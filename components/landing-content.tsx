"use client";

import { motion } from "framer-motion";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  ChatBubbleLeftRightIcon,
  UsersIcon,
  VideoCameraIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Lottie from "lottie-react";
import peopleChattingAnimation from "../public/animations/Live-Animation1.json";

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.3 } },
  hover: { scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" },
};

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2 },
  }),
};

const features = [
  {
    icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-400" />,
    title: "Live Chat",
    description: "Engage in real-time conversations with friends and communities.",
  },
  {
    icon: <UsersIcon className="h-8 w-8 text-indigo-400" />,
    title: "Create Channels",
    description: "Organize discussions with dedicated channels for any topic.",
  },
  {
    icon: <VideoCameraIcon className="h-8 w-8 text-indigo-400" />,
    title: "Video Calls",
    description: "Connect face-to-face with high-quality video calls.",
  },
  {
    icon: <PhoneIcon className="h-8 w-8 text-indigo-400" />,
    title: "Voice Calls",
    description: "Stay connected with crystal-clear voice calls.",
  },
];

export const LandingContent = () => {
  return (
    <div className="relative min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1E1F22] via-[#2A2B2F] to-[#313338]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Lottie
            animationData={peopleChattingAnimation}
            loop={true}
            className="w-full max-w-3xl opacity-20"
          />
        </div>
        <div className="relative z-10 text-center space-y-8 p-6">
          <motion.h1
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500"
          >
            GupShup
          </motion.h1>
          <motion.p
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Your ultimate platform for live chats, channels, video, and voice calls.
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <SignInButton >
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg"
                >
                  Log In
                </Button>
              </SignInButton>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <SignUpButton >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-[#2A2B2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={heroVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12 text-indigo-400"
          >
            Why Choose GupShup?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                custom={index}
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 bg-[#1E1F22] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};