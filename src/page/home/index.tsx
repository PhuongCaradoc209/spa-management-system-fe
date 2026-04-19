import React from "react";
import AppButton from "@/components/common/AppButton";

const HomePage: React.FC = () => {
  return (
    <div className="pt-24 animate-in fade-in duration-700">
      {/* Section 1: Hero Section */}
      <section className="relative w-full h-[795px] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Serene Spa Garden" 
            className="w-full h-full object-cover" 
            src="https://i.pinimg.com/1200x/2a/09/39/2a0939817b0659d9252cb54f44757ea5.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl text-left">
            <h1 className="font-headline font-bold text-6xl md:text-7xl text-primary leading-[1.1] tracking-tight mb-8">
              Welcome to <span className="text-tertiary">Serene Spa.</span><br />Book Your Escape.
            </h1>
            <div className="flex items-center gap-6">
              <AppButton variant="primary" size="xl" className="ring-2 ring-tertiary/20">
                Book Your Visit
              </AppButton>
              <div className="flex items-center gap-3 text-primary/70 font-medium cursor-pointer hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined">play_circle</span>
                <span>Take a Tour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Services */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="font-label text-xs font-bold tracking-[0.2em] text-tertiary mb-4 block uppercase leading-none">OUR EXPERTISE</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary leading-tight">Curated Rituals for Inner Peace</h2>
          </div>
          <p className="font-body text-lg text-primary/60 max-w-sm">Every treatment is an intentional journey through the elements of nature and soul.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="group relative bg-surface-container-low rounded-[2.5rem] p-4 pb-12 transition-all duration-700 hover:bg-primary-container/20 overflow-hidden">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-8">
              <img 
                alt="Botanical Facial" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsfBXLi6ZWp6ks2Q2jN9Kkku4QL9jnMJXFJqAkyGNKXxCaAplrh7W2Bk3IyeLBRoz7rOtLEBOyaKZL-ar8MLlYnkT6oMnb8daFm-mar1zKAIGGThm_lPLqXQrG8MpOea4nCz9yx98D1rj-tH_USzqGynmvwsDN76RGutsNJC63-urOtJmS52QM6EiIcN7EZX9sL_Eka-onPcInGKm7VGYMKQPG1HukbdCF3J2jbpc2KUeODE7XuFs34P-DbNOuA12Xb1v0cZsn7AM"
              />
            </div>
            <div className="px-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline text-2xl font-bold text-primary">Botanical Essence</h3>
                <span className="text-tertiary font-bold">$140</span>
              </div>
              <p className="text-primary/60 leading-relaxed mb-6">A deep hydration treatment using organic cucumber and local honey infusions.</p>
              <span className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all cursor-pointer">
                Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* Service 2 */}
          <div className="group relative bg-surface-container-low rounded-[2.5rem] p-4 pb-12 mt-12 md:mt-0 transition-all duration-700 hover:bg-secondary-container/20 overflow-hidden">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-8">
              <img 
                alt="River Stone Therapy" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfSSKJPd9cbJ5iFRf-uzBtbNl206Q96eLRtK9VXeQtWvzLbMEhY-mSWpgC8xIFDM8B7GUecMYgF3EPH8inWMeTuEC8R7-QG1g_nk8umQYtJmANnJAfFF6eEvG6p6-A5eX-IRM20EkIjlDgzdATaWjYxPRUf_HM1WXA5BRm2MdrJCdPczrTnUOgq-FQKZ13EjJ_CBzy2_MpWu-fmG45O8UfArrEZjl4j5uhnfYEmD7UOcC31tE9FlkwALp2W_xel-w5p-YUza7UAcw"
              />
            </div>
            <div className="px-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline text-2xl font-bold text-primary">River Balance</h3>
                <span className="text-tertiary font-bold">$185</span>
              </div>
              <p className="text-primary/60 leading-relaxed mb-6">Heated volcanic stones are used to release muscle tension and align your energy flow.</p>
              <span className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all cursor-pointer">
                Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* Service 3 */}
          <div className="group relative bg-surface-container-low rounded-[2.5rem] p-4 pb-12 transition-all duration-700 hover:bg-primary-container/20 overflow-hidden">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-8">
              <img 
                alt="Foot Reflexology" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9-zWBOQVXLAIcygkppFUTToSYzq4z2jXqJ6NK1lNnuiFZiHay8Av_XHeU0z1AQ9-SL1OZcHhFZPYt7U5URiz40ZIelbDV8K_tiieUoOFUzV41dAtWRgEE8rLnOUqhHeTv3zuCKqkonmFUA_mQ9DIHJ6tujrjwYSvJUw7K5rfwGB3_y_8YXatM_lzwI8pV1ES_b5idYJWfBu1GUGJi8ETUIjAHLYgKEY97vwjzPVdf08RSKcs3c8UCVKOEM1WVuT3LmfEV0o5mPe0"
              />
            </div>
            <div className="px-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline text-2xl font-bold text-primary">Earth Connection</h3>
                <span className="text-tertiary font-bold">$110</span>
              </div>
              <p className="text-primary/60 leading-relaxed mb-6">Traditional reflexology techniques focused on grounding your body and mind.</p>
              <span className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all cursor-pointer">
                Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Testimonials */}
      <section className="bg-surface-container-low py-32 rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <span className="font-label text-xs font-bold tracking-[0.2em] text-tertiary mb-4 block uppercase leading-none">TESTIMONIALS</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Voices of Tranquility</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(62,102,88,0.05)] flex flex-col justify-between">
              <p className="font-body text-xl italic text-primary/80 leading-relaxed mb-10">
                &quot;The moment I stepped in, the air felt different. Every detail, from the wooden pillars to the sound of flowing water, is designed for pure peace.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-primary">Elena Vance</h4>
                  <span className="text-primary/40 text-sm">Loyal Member</span>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-surface-container-lowest p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(62,102,88,0.05)] flex flex-col justify-between">
              <p className="font-body text-xl italic text-primary/80 leading-relaxed mb-10">
                &quot;The River Balance massage was life-changing. I&apos;ve never felt more grounded and revitalized. It is truly a sanctuary in the city.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-primary">Marcus Thorne</h4>
                  <span className="text-primary/40 text-sm">First-time Guest</span>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(62,102,88,0.05)] flex flex-col justify-between">
              <p className="font-body text-xl italic text-primary/80 leading-relaxed mb-10">
                &quot;A masterclass in luxury. The botanical facial left my skin glowing for days. Can&apos;t wait for my next escape to the pavilion.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-primary">Sarah Jenkins</h4>
                  <span className="text-primary/40 text-sm">Regular Client</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

