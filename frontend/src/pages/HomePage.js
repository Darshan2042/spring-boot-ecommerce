import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Truck, Stars, ShoppingBag, HeartHandshake } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import { useScrollAnimation } from '../hooks/useAnimation';

const HomePage = ({ setCurrentPage }) => {
  const { currentUser } = useAppContext();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  const isAdmin = currentUser?.roles?.some((role) => role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN') || false;

  const features = [
    { icon: Sparkles, title: 'Curated Selection', desc: 'Premium items presented with editorial-style polish.' },
    { icon: Truck, title: 'Fast Fulfillment', desc: 'Smooth shopping flow with transparent delivery tracking.' },
    { icon: ShieldCheck, title: 'Trusted Checkout', desc: 'Secure payments and reassuring status updates.' },
  ];

  const stats = [
    { count: '10K+', label: 'Happy Customers' },
    { count: '500+', label: 'Quality Products' },
    { count: '99%', label: 'Satisfaction Rate' },
  ];

  return (
    <motion.div
      className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          className="glass-panel relative overflow-hidden rounded-[28px] p-8 sm:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.12),transparent_28%)]" />
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <Stars className="h-4 w-4" />
              Premium shopping experience
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Elegant commerce for modern shopping.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              {isAdmin
                ? 'Manage products and orders through a refined, responsive admin workspace.'
                : currentUser
                ? 'Discover curated products, faster checkout, and a smoother buying journey.'
                : 'Browse, compare, and buy with a polished storefront built for trust and speed.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <AnimatedButton onClick={() => setCurrentPage('products')} variant="primary" className="px-6 py-3">
                <span className="inline-flex items-center gap-2">Explore Products <ArrowRight size={16} /></span>
              </AnimatedButton>
              {!currentUser && !isAdmin && (
                <AnimatedButton onClick={() => setCurrentPage('customerLogin')} variant="secondary" className="px-6 py-3">
                  Customer Login
                </AnimatedButton>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
              {['Secure payments', 'Fast shipping', 'Responsive UI', 'Order tracking'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
                  <HeartHandshake className="h-4 w-4 text-teal-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.aside
          className="grid gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="premium-card overflow-hidden rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Featured</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Shop smarter</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 rounded-[24px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-2xl">
              <p className="text-sm text-slate-300">Today&apos;s drop</p>
              <p className="mt-2 text-2xl font-semibold">Premium essentials with modern checkout</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><ShieldCheck className="h-4 w-4" /> Secure</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><Truck className="h-4 w-4" /> Fast</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <AnimatedCard key={feature.title} index={index} className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-slate-600">{feature.desc}</p>
            </AnimatedCard>
          );
        })}
      </section>

      <motion.section
        ref={statsRef}
        className="mt-8 grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={statsVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="premium-card rounded-[28px] p-6 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={statsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <div className="text-4xl font-bold text-slate-900">{stat.count}</div>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {!currentUser && !isAdmin && (
        <motion.section
          className="mt-8 glass-panel rounded-[28px] p-8 text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900">Get started today</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">Create an account and experience a cleaner, faster way to shop.</p>
          <div className="mt-6 flex justify-center">
            <AnimatedButton onClick={() => setCurrentPage('customerLogin')} variant="primary" className="px-8 py-3">
              Sign Up
            </AnimatedButton>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};

export default HomePage;