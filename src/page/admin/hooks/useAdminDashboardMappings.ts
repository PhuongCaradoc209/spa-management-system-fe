import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { staffService } from "@/services/staff.service";
import { serviceService } from "@/services/service.service";
import { loyaltyService } from "@/services/loyalty.service";
import { UserRole } from "@/constant/enum/user.enum";

type ListPayload = Record<string, unknown> | undefined;
type UserItem = {
  id: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  customer?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
};
type StaffItem = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
};
type CustomerEntry = {
  userId: string;
  customerId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
};
type ServiceItem = { id: string; name?: string };
type LoyaltyValue = {
  tier?: string;
  score?: number;
  lifetimeScore?: number;
  updatedAt?: string | null;
};
type LoyaltyPayload = {
  customerId?: string;
  loyalty?: LoyaltyValue;
  data?: unknown;
  result?: unknown;
};

const extractItems = <T>(payload: ListPayload): T[] => {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  const items =
    record.items ??
    record.data ??
    record.users ??
    record.staff ??
    record.services;
  return Array.isArray(items) ? (items as T[]) : [];
};

const normalizeLoyalty = (payload: unknown): LoyaltyValue | undefined => {
  if (!payload || typeof payload !== "object") return undefined;
  const direct = payload as LoyaltyPayload;

  if (direct.loyalty && typeof direct.loyalty === "object") {
    return direct.loyalty;
  }
  if (direct.data && typeof direct.data === "object") {
    return normalizeLoyalty(direct.data);
  }
  if (direct.result && typeof direct.result === "object") {
    return normalizeLoyalty(direct.result);
  }
  return direct as LoyaltyValue;
};

const getLoyaltyCustomerId = (
  payload: unknown,
  fallbackCustomerId: string,
): string => {
  if (!payload || typeof payload !== "object") return fallbackCustomerId;
  const direct = payload as LoyaltyPayload;

  if (typeof direct.customerId === "string" && direct.customerId) {
    return direct.customerId;
  }
  if (direct.data && typeof direct.data === "object") {
    return getLoyaltyCustomerId(direct.data, fallbackCustomerId);
  }
  if (direct.result && typeof direct.result === "object") {
    return getLoyaltyCustomerId(direct.result, fallbackCustomerId);
  }
  return fallbackCustomerId;
};

export function useAdminDashboardMappings() {
  // Users (customers)
  const usersQuery = useQuery({
    queryKey: ["users", "all"],
    queryFn: () => userService.listUsers(),
  });
  // Staff
  const staffQuery = useQuery({
    queryKey: ["staff", "all"],
    queryFn: () => staffService.listStaff(),
  });
  // Services
  const servicesQuery = useQuery({
    queryKey: ["services", "all"],
    queryFn: () => serviceService.listServices(),
  });

  // Map users by id
  const users = useMemo(
    () => extractItems<UserItem>(usersQuery.data as ListPayload),
    [usersQuery.data],
  );
  const staff = useMemo(
    () => extractItems<StaffItem>(staffQuery.data as ListPayload),
    [staffQuery.data],
  );
  const services = useMemo(
    () => extractItems<ServiceItem>(servicesQuery.data as ListPayload),
    [servicesQuery.data],
  );

  const customers = useMemo<CustomerEntry[]>(() => {
    return users
      .filter((user) => !user.role || user.role === UserRole.Customer)
      .map((user) => ({
        userId: user.id,
        customerId: user.customer?.id,
        firstName: user.customer?.firstName ?? user.firstName,
        lastName: user.customer?.lastName ?? user.lastName,
        name: user.name,
        email: user.email,
      }));
  }, [users]);

  const usersMap = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users],
  );
  const customerProfilesMap = useMemo(() => {
    const entries = customers
      .filter((customer) => customer.customerId)
      .map((customer) => [customer.customerId as string, customer]);
    return Object.fromEntries(entries) as Record<string, CustomerEntry>;
  }, [customers]);
  const staffMap = useMemo(
    () => Object.fromEntries(staff.map((member) => [member.id, member])),
    [staff],
  );
  const servicesMap = useMemo(
    () => Object.fromEntries(services.map((service) => [service.id, service])),
    [services],
  );

  const loyaltyQueries = useQueries({
    queries: customers.map((customer) => ({
      queryKey: ["loyalty", customer.customerId],
      queryFn: () =>
        loyaltyService.getCustomerLoyalty(customer.customerId as string),
      enabled: Boolean(customer.customerId),
    })),
  });

  const loyaltyByCustomerId = useMemo(() => {
    const result: Record<string, LoyaltyValue | undefined> = {};
    loyaltyQueries.forEach((query, index) => {
      const customer = customers[index];
      if (!customer?.customerId) return;
      const payload = query.data;
      const responseCustomerId = getLoyaltyCustomerId(
        payload,
        customer.customerId,
      );
      result[responseCustomerId] = normalizeLoyalty(payload);
    });
    return result;
  }, [customers, loyaltyQueries]);

  return {
    users,
    staff,
    services,
    customers,
    usersMap,
    customerProfilesMap,
    staffMap,
    servicesMap,
    usersLoading: usersQuery.isLoading,
    staffLoading: staffQuery.isLoading,
    servicesLoading: servicesQuery.isLoading,
    loyaltyByCustomerId,
    loyaltyLoading: loyaltyQueries.some((query) => query.isLoading),
  };
}
