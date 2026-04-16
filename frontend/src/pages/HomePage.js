import React from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import AnimatedCard from "../components/AnimatedCard";
import AnimatedButton from "../components/AnimatedButton";
import { useScrollAnimation } from "../hooks/useAnimation";

const HomePage = ({ setCurrentPage }) => {
  const { currentUser } = useAppContext();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  const isAdmin =
    currentUser?.roles?.some(
      (role) => role === "ROLE_ADMIN" || role.name === "ROLE_ADMIN"
    ) || false;

  const features = [
    { icon: "✨", title: "Quality Products", desc: "Hand-picked items from trusted sellers" },
    { icon: "🚚", title: "Fast Delivery", desc: "Quick shipping with tracking" },
    { icon: "🔒", title: "Secure Payment", desc: "Safe and trusted checkout" },
  ];

  return (
    <motion.div
      className="min-h-screen bg-[#F8FBFD] px-6 md:px-12 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HERO SECTION */}
      <motion.div
        className="bg-gradient-to-br from-[#BFD7E3] to-[#F5FAFD] rounded-2xl p-10 text-center shadow-sm mb-12"
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Welcome to ShopHub
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isAdmin
            ? "Admin Dashboard - Manage your products and orders"
            : currentUser
            ? "Discover amazing products at the best prices"
            : "Shop simple, smart and fast"}
        </motion.p>

        {/* BUTTONS */}
        {!currentUser && !isAdmin && (
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatedButton
              onClick={() => setCurrentPage("customerLogin")}
              variant="secondary"
              className="px-6 py-3"
            >
              Customer Login
            </AnimatedButton>

            <AnimatedButton
              onClick={() => setCurrentPage("products")}
              variant="primary"
              className="px-6 py-3"
            >
              Explore Products
            </AnimatedButton>
          </motion.div>
        )}

        {currentUser && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatedButton
              onClick={() => setCurrentPage("products")}
              variant="primary"
              className="px-8 py-3"
            >
              Start Shopping
            </AnimatedButton>
          </motion.div>
        )}
      </motion.div>

      {/* FEATURES SECTION */}
      <div className="mb-12">
        <motion.h2
          className="text-3xl font-semibold text-center text-gray-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why Choose ShopHub?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <AnimatedCard key={idx} index={idx} className="p-6 text-center">
              <motion.div
                className="text-5xl mb-4 inline-block"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* STATS SECTION */}
      <motion.div
        ref={statsRef}
        className="grid md:grid-cols-3 gap-8 mb-12"
        initial={{ opacity: 0 }}
        animate={statsVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {[
          { count: "10K+", label: "Happy Customers" },
          { count: "500+", label: "Quality Products" },
          { count: "99%", label: "Satisfaction Rate" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={statsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="text-4xl font-bold text-blue-600 mb-2"
              initial={{ scale: 0 }}
              animate={statsVisible ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 + idx * 0.1 }}
            >
              {stat.count}
            </motion.div>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA SECTION */}
      {!currentUser && (
        <motion.div
          className="bg-[#EAF4F8] rounded-2xl p-10 text-center shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <motion.h2
            className="text-3xl font-semibold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Get Started Today
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Create an account and start shopping now
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AnimatedButton
              onClick={() => setCurrentPage("customerLogin")}
              variant="primary"
              className="px-8 py-3"
            >
              Sign Up
            </AnimatedButton>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomePage;