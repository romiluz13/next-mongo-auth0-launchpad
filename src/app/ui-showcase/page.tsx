"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Menu } from 'lucide-react';

export default function UIShowcase() {
  const showToast = (variant: string) => {
    toast({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: `This is a ${variant} toast notification.`,
      variant: variant as any,
    });
  };

  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-emerald-500 mb-4">MongoDB UI Components</h1>
        <p className="text-xl text-gray-400">A showcase of MongoDB-styled UI components</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Dropdown Menus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Basic Dropdown</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Menu className="mr-2 h-4 w-4" />
                  <span>Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Advanced Dropdown</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Menu className="mr-2 h-4 w-4" />
                  <span>MongoDB Products</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>MongoDB Services</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Atlas</DropdownMenuItem>
                  <DropdownMenuItem>Realm</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Tools</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Compass</DropdownMenuItem>
                      <DropdownMenuItem>Charts</DropdownMenuItem>
                      <DropdownMenuItem>Atlas CLI</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Plans</DropdownMenuLabel>
                <DropdownMenuRadioGroup value="free">
                  <DropdownMenuRadioItem value="free">Free</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="pro">Pro</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="enterprise">Enterprise</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Form Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Inputs</h3>
            <div className="space-y-4">
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
              <Input placeholder="With label" id="with-label" />
              <div className="flex items-center space-x-2">
                <Input placeholder="With button" className="flex-grow" />
                <Button>Submit</Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Textareas</h3>
            <div className="space-y-4">
              <Textarea placeholder="Default textarea" />
              <Textarea placeholder="Disabled textarea" disabled />
              <div className="space-y-2">
                <Textarea placeholder="With button" className="min-h-[120px]" />
                <div className="flex justify-end">
                  <Button>Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Checkboxes</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" defaultChecked />
            <label
              htmlFor="marketing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Receive marketing emails
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <label
              htmlFor="disabled"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Disabled checkbox
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Select</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Basic Select</h3>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">MongoDB Products</h3>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a MongoDB product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atlas">MongoDB Atlas</SelectItem>
                <SelectItem value="compass">MongoDB Compass</SelectItem>
                <SelectItem value="realm">MongoDB Realm</SelectItem>
                <SelectItem value="charts">MongoDB Charts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="animate-slide-in" variant="default" hover="lift">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a basic card component with header, content, and footer sections.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          
          <Card className="animate-slide-in [animation-delay:200ms]" variant="default" hover="glow">
            <CardHeader>
              <CardTitle>MongoDB Atlas</CardTitle>
              <CardDescription>Cloud Database Service</CardDescription>
            </CardHeader>
            <CardContent>
              <p>MongoDB Atlas is a fully-managed cloud database developed by the same people that build MongoDB.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Learn More</Button>
              <Button>Get Started</Button>
            </CardFooter>
          </Card>
          
          <Card className="animate-slide-in [animation-delay:400ms]" variant="default" hover="both">
            <CardHeader>
              <CardTitle>MongoDB Compass</CardTitle>
              <CardDescription>GUI for MongoDB</CardDescription>
            </CardHeader>
            <CardContent>
              <p>MongoDB Compass is the GUI for MongoDB, allowing you to explore your data visually.</p>
            </CardContent>
            <CardFooter>
              <Button>Download</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Spinners</h2>
        <div className="flex items-center gap-8">
          <div>
            <p className="mb-2">Small</p>
            <Spinner size="sm" />
          </div>
          <div>
            <p className="mb-2">Medium</p>
            <Spinner size="md" />
          </div>
          <div>
            <p className="mb-2">Large</p>
            <Spinner size="lg" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500 mb-4">Toasts</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => showToast('default')}>Default Toast</Button>
          <Button onClick={() => showToast('destructive')} variant="destructive">Error Toast</Button>
          <Button onClick={() => showToast('success')} className="bg-green-500 hover:bg-green-600">Success Toast</Button>
          <Button onClick={() => showToast('warning')} className="bg-yellow-500 hover:bg-yellow-600">Warning Toast</Button>
          <Button onClick={() => showToast('info')} className="bg-blue-500 hover:bg-blue-600">Info Toast</Button>
        </div>
      </section>
    </div>
  );
} 