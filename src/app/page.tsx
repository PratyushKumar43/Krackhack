'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I sign up?",
      answer: "Simply click the 'Get Started' button, choose your preferred authentication method (Google or email), and follow the easy registration process. You'll be creating your first time capsule in minutes!"
    },
    {
      question: "What features are available for different roles?",
      answer: "All users can create and manage time capsules, set unlock dates, and add various types of media. Premium users get additional features like increased storage, advanced privacy settings, and the ability to create collaborative capsules."
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes! MemoVault is available on both iOS and Android platforms. Download our mobile app to create and access your time capsules on the go. All your data syncs seamlessly across devices."
    },
    {
      question: "How is my data secured?",
      answer: "We use industry-standard encryption to protect your memories. Your data is stored in secure cloud servers, and we implement OAuth2-based authentication to ensure only you can access your private capsules."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF5EB]">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center pt-16">
        <Image
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-4.0.3"
          alt="Digital Time Capsule"
          fill
          className="object-cover brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Preserve Your Memories in a Digital Time Capsule
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Lock away your precious moments and rediscover them in the future. Create your digital legacy today.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-[#FF9F87] hover:bg-[#FF7A5C] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          Why Choose MemoVault?
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FF9F87] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Secure Storage</h3>
            <p className="text-gray-600">Your memories are encrypted and safely stored until their unlock date.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FF9F87] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⏰</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Time-Based Unlocking</h3>
            <p className="text-gray-600">Set specific dates for your capsules to unlock and reveal their contents.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FF9F87] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🌟</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Rich Media Support</h3>
            <p className="text-gray-600">Store text, images, videos, and more in your digital time capsules.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF9F87] to-[#FF7A5C]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/90">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/90">Time Capsules Created</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-white/90">Memories Stored</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/90">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Find answers to common questions about MemoVault
          </p>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-[#FF9F87] text-2xl transform transition-transform duration-200" style={{
                    transform: openFaqIndex === index ? 'rotate(45deg)' : 'none'
                  }}>
                    +
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF9F87] to-[#FF7A5C]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Create Your First Time Capsule?
          </h2>
          <Link
            href="/auth/login"
            className="inline-block bg-white text-[#FF7A5C] font-semibold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">MemoVault</h3>
              <p className="text-gray-400">Preserving today's memories for tomorrow's discoveries.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/feedback" className="text-gray-400 hover:text-white transition-colors">Feedback</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MemoVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
