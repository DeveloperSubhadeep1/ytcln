import { Home, Compass, PlaySquare, Clock, ThumbsUp, Film } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: PlaySquare, label: "Subscriptions", href: "/subscriptions" },
    { icon: Clock, label: "History", href: "/history" },
    { icon: ThumbsUp, label: "Liked videos", href: "/liked" },
    { icon: Film, label: "Your videos", href: "/your-videos" },
  ];

  return (
    <aside className="w-64 bg-background border-r shrink-0 h-screen pt-16 hidden md:block">
      <nav className="p-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                location === link.href ? "bg-accent" : ""
              }`}
            >
              <link.icon className="h-5 w-5 mr-4" />
              {link.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}