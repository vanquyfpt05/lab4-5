import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background text-foreground">
      <div className="container px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">NextStore</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your premium destination for high-quality tech essentials. Upgrade your setup with our curated collection of gadgets and accessories.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Featured Products</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@nextstore.com" className="hover:text-primary">support@nextstore.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890" className="hover:text-primary">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NextStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
