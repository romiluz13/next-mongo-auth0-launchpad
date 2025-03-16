"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { 
  ArrowRightIcon, 
  CodeBracketIcon, 
  ServerIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  CubeIcon, 
  CommandLineIcon,
  RocketLaunchIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { MongoDBLogo, NextjsLogo, Auth0Logo } from "@/features/layout";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Terminal text animation effect
  useEffect(() => {
    if (mounted) {
      const text = 'npm install mongodb-developer-launchpad';
      let index = 0;
      const interval = setInterval(() => {
        setTerminalText(text.substring(0, index));
        index++;
        if (index > text.length) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  // Network grid animation
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    // Create nodes
    const nodeCount = 20;
    const nodes: {x: number; y: number; vx: number; vy: number; radius: number}[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0, 237, 100, 0.05)';
      ctx.lineWidth = 1;
      
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 237, 100, 0.7)';
        ctx.fill();
      }
      
      // Draw connections
      ctx.strokeStyle = 'rgba(0, 237, 100, 0.15)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [mounted]);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
    }
  }, [error]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-mongodb-dark">
        <div className="text-red-500">
          Authentication error. Please try again later.
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative animate-data-flow">
      {/* Tech Grid Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
        style={{ opacity: 0.8 }}
      />
      
      {/* Additional background effects */}
      <div className="absolute inset-0 z-0 animate-matrix-bg"></div>
      <div className="absolute inset-0 z-0 animate-scanline"></div>
      
      <section className="py-20 md:py-28 lg:py-36 container mx-auto text-center px-4 relative z-10">
        <div className="animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 overflow-hidden transition-transform duration-300 animate-float animate-tech-pulse bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-emerald-500/20">
              <div className="animate-glitch">
                <MongoDBLogo width={72} height={72} />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 animate-glitch">
            MongoDB Developer's Launch Pad
          </h1>
          <p className="text-xl md:text-2xl text-mongodb-gray-300 max-w-3xl mx-auto mb-10 relative">
            The ultimate AI-optimized template for building production-ready applications with MongoDB, Next.js, and Auth0.
          </p>
          
          {/* Terminal demo */}
          <div className="max-w-2xl mx-auto mb-10 bg-mongodb-dark-600/95 border border-emerald-500/20 rounded-lg overflow-hidden shadow-xl">
            <div className="flex items-center bg-mongodb-dark-500 px-4 py-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <div className="flex-1 text-xs text-center text-mongodb-gray-300">Terminal</div>
            </div>
            <div className="p-4 font-mono text-sm text-left">
              <div className="flex">
                <span className="text-emerald-500">$</span>
                <span className="text-white ml-2 animate-blinking-cursor">
                  {terminalText}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="animate-slide-in [animation-delay:200ms] animate-pulse-glow relative overflow-hidden">
              <span className="relative z-10">Get Started</span>
            </Button>
            <Button size="lg" variant="outline" className="animate-slide-in [animation-delay:300ms] border-emerald-500/50 hover:bg-emerald-500/10">
              View Documentation
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-500/30 bg-mongodb-dark-500/50">Next.js 14</Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-500/30 bg-mongodb-dark-500/50">TypeScript</Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-500/30 bg-mongodb-dark-500/50">MongoDB</Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-500/30 bg-mongodb-dark-500/50">Auth0</Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-500/30 bg-mongodb-dark-500/50">Tailwind CSS</Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-500/30 bg-mongodb-dark-500/50">Shadcn UI</Badge>
          </div>
        </div>
      </section>

      {/* AI-Optimized Section */}
      <section className="py-16 bg-mongodb-dark-600/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">Designed for AI Collaboration</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
              <span className="relative z-10 animate-glitch">Optimized for AI-Assisted Development</span>
            </h2>
            <p className="text-mongodb-gray-300 max-w-3xl mx-auto">
              Build faster with a template specifically designed for AI tools like Claude 3.7 Sonnet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default" hover="lift" className="animate-slide-in [animation-delay:100ms] border-emerald-500/20 bg-mongodb-dark-500/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-400">Type-Safe Everywhere</CardTitle>
                <CardDescription>End-to-end type safety</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Complete TypeScript integration with Zod validation helps AI understand your code's structure and generate type-compatible implementations.</p>
              </CardContent>
            </Card>

            <Card variant="default" hover="lift" className="animate-slide-in [animation-delay:200ms] border-emerald-500/20 bg-mongodb-dark-500/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-400">Predictable Structure</CardTitle>
                <CardDescription>Feature-based organization</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Organized around business domains with consistent patterns that make it easy for AI to navigate and extend your codebase.</p>
              </CardContent>
            </Card>

            <Card variant="default" hover="lift" className="animate-slide-in [animation-delay:300ms] border-emerald-500/20 bg-mongodb-dark-500/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-400">Clean Component APIs</CardTitle>
                <CardDescription>Well-documented interfaces</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Components with clear props interfaces and documentation that help AI understand usage patterns and generate matching code.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Cutting-Edge Stack</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built with the Best Tools
          </h2>
          <p className="text-mongodb-gray-300 max-w-3xl mx-auto">
            A carefully selected stack of modern technologies designed to work perfectly together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-emerald-500/30 bg-mongodb-dark-500/50 backdrop-blur-sm animate-slide-in [animation-delay:100ms] hover:border-emerald-500/70 transition-all duration-300 group">
            <h3 className="text-xl font-semibold text-emerald-500 mb-3 group-hover:animate-glitch">Next.js 14</h3>
            <p className="text-mongodb-gray-300">Server Components, App Router, and optimized rendering for lightning-fast applications.</p>
          </div>

          <div className="p-6 rounded-lg border border-emerald-500/30 bg-mongodb-dark-500/50 backdrop-blur-sm animate-slide-in [animation-delay:150ms] hover:border-emerald-500/70 transition-all duration-300 group">
            <h3 className="text-xl font-semibold text-emerald-500 mb-3 group-hover:animate-glitch">MongoDB</h3>
            <p className="text-mongodb-gray-300">Flexible document database with Mongoose ODM for elegant data modeling and type safety.</p>
          </div>

          <div className="p-6 rounded-lg border border-emerald-500/30 bg-mongodb-dark-500/50 backdrop-blur-sm animate-slide-in [animation-delay:200ms] hover:border-emerald-500/70 transition-all duration-300 group">
            <h3 className="text-xl font-semibold text-emerald-500 mb-3 group-hover:animate-glitch">TypeScript</h3>
            <p className="text-mongodb-gray-300">Complete type safety throughout the codebase for confident development and refactoring.</p>
          </div>

          <div className="p-6 rounded-lg border border-emerald-500/30 bg-mongodb-dark-500/50 backdrop-blur-sm animate-slide-in [animation-delay:250ms] hover:border-emerald-500/70 transition-all duration-300 group">
            <h3 className="text-xl font-semibold text-emerald-500 mb-3 group-hover:animate-glitch">Auth0</h3>
            <p className="text-mongodb-gray-300">Enterprise-grade authentication with JWT handling, role-based access, and session management.</p>
          </div>

          <div className="p-6 rounded-lg border border-emerald-500/30 bg-mongodb-dark-500/50 backdrop-blur-sm animate-slide-in [animation-delay:300ms] hover:border-emerald-500/70 transition-all duration-300 group">
            <h3 className="text-xl font-semibold text-emerald-500 mb-3 group-hover:animate-glitch">Tailwind CSS</h3>
            <p className="text-mongodb-gray-300">Utility-first CSS framework for rapid UI development with MongoDB-inspired design system.</p>
          </div>

          <div className="p-6 rounded-lg border border-emerald-500/30 bg-mongodb-dark-500/50 backdrop-blur-sm animate-slide-in [animation-delay:350ms] hover:border-emerald-500/70 transition-all duration-300 group">
            <h3 className="text-xl font-semibold text-emerald-500 mb-3 group-hover:animate-glitch">Testing Suite</h3>
            <p className="text-mongodb-gray-300">Comprehensive testing infrastructure with Jest, React Testing Library, and Cypress.</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/ui-showcase">
            <Button variant="outline" size="lg" className="border-emerald-500/40 hover:bg-emerald-500/10">
              Explore UI Components
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-mongodb-dark-600/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-500/30">Production Ready</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-mongodb-gray-300 max-w-3xl mx-auto">
              Start building immediately with a complete set of features and components
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-mongodb-dark-500/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                <div className="mt-1 bg-emerald-500/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Feature-Based Architecture</h3>
                  <p className="text-mongodb-gray-300">Organized around business domains for better maintainability and scalability</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-mongodb-dark-500/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                <div className="mt-1 bg-emerald-500/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">MongoDB Integration</h3>
                  <p className="text-mongodb-gray-300">Optimized connection handling, validation, and error management</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-mongodb-dark-500/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                <div className="mt-1 bg-emerald-500/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Authentication & Security</h3>
                  <p className="text-mongodb-gray-300">Secure Auth0 integration with JWT handling and role-based access control</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-mongodb-dark-500/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                <div className="mt-1 bg-emerald-500/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Modern UI Components</h3>
                  <p className="text-mongodb-gray-300">Beautiful, accessible components styled with MongoDB's design language</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-mongodb-dark-500/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                <div className="mt-1 bg-emerald-500/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Performance Optimized</h3>
                  <p className="text-mongodb-gray-300">Leverages Next.js optimizations for excellent Core Web Vitals</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-mongodb-dark-500/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                <div className="mt-1 bg-emerald-500/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">DevOps Ready</h3>
                  <p className="text-mongodb-gray-300">Docker support, CI/CD workflows, and deployment configurations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <p className="text-mongodb-gray-300 text-sm uppercase tracking-wider">Powered by industry leaders</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="flex items-center justify-center animate-float">
            <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group w-40 h-40 flex items-center justify-center">
              <MongoDBLogo width={100} height={100} className="group-hover:animate-glitch" />
            </div>
          </div>
          <div className="flex items-center justify-center animate-float [animation-delay:1s]">
            <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group w-40 h-40 flex items-center justify-center">
              <Image src="/nextjs-logo.png" alt="Next.js" width={100} height={100} className="group-hover:animate-glitch" />
            </div>
          </div>
          <div className="flex items-center justify-center animate-float [animation-delay:2s]">
            <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group w-40 h-40 flex items-center justify-center">
              <Image src="/auth0-logo.png" alt="Auth0" width={100} height={100} className="group-hover:animate-glitch" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-mongodb-dark to-mongodb-dark-600 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative inline-block">
            <span className="relative z-10">Ready to Build Something Amazing?</span>
          </h2>
          <p className="text-mongodb-gray-300 max-w-3xl mx-auto mb-8">
            Start building your next project with the perfect foundation for AI-assisted development
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="animate-tech-pulse bg-emerald-500 hover:bg-emerald-600 transition-all duration-300">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300">
              View on GitHub
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
