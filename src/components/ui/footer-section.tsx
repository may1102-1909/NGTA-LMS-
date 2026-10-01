"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react"

function Footerdemo() {
  return (
    <footer className="relative border-t border-zinc-800 bg-black text-white">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">Stay Connected</h2>
            <p className="mb-6 text-white text-sm">
              Join our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 bg-black border-zinc-800 text-white placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-white"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-[#EFFF4F] text-[#28282B] transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="/dashboard" className="block text-white transition-colors hover:text-[#EFFF4F]">
                Dashboard
              </a>
              <a href="/memberships" className="block text-white transition-colors hover:text-[#EFFF4F]">
                Membership
              </a>
              <a href="/courses" className="block text-white transition-colors hover:text-[#EFFF4F]">
                Courses
              </a>
              <a href="/settings" className="block text-white transition-colors hover:text-[#EFFF4F]">
                Settings
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic text-white">
              <p>123 Innovation Street</p>
              <p>Tech City, TC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: hello@example.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-black border-zinc-800 text-white hover:bg-zinc-900 hover:text-white">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 text-white border-zinc-800">
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-black border-zinc-800 text-white hover:bg-zinc-900 hover:text-white">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 text-white border-zinc-800">
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-black border-zinc-800 text-white hover:bg-zinc-900 hover:text-white">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 text-white border-zinc-800">
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-black border-zinc-800 text-white hover:bg-zinc-900 hover:text-white">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 text-white border-zinc-800">
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-center md:flex-row">
          <p className="text-sm text-white">
            © 2026 NextGen Testing Academy. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="/privacy" className="text-white transition-colors hover:text-[#EFFF4F]">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white transition-colors hover:text-[#EFFF4F]">
              Terms of Service
            </a>
            <a href="/cookies" className="text-white transition-colors hover:text-[#EFFF4F]">
              Cookie Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }
