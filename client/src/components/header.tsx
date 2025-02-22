import { Search, Bell, Video, Menu, User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { SiYoutube } from "react-icons/si";

export function Header() {
  const [, setLocation] = useLocation();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    setLocation(`/search/${encodeURIComponent(query)}`);
  }

  return (
    <header className="h-16 bg-background border-b fixed top-0 left-0 right-0 z-50">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="flex items-center gap-1">
            <SiYoutube className="h-6 w-6 text-red-600" />
            <span className="font-semibold text-lg">YouTube</span>
          </a>
        </div>

        <form
          onSubmit={handleSearch}
          className="max-w-xl w-full flex items-center gap-4"
        >
          <div className="flex-1 flex items-center">
            <Input
              name="search"
              className="rounded-r-none"
              placeholder="Search"
            />
            <Button
              type="submit"
              variant="secondary"
              className="rounded-l-none px-6"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/upload")}>
            <Upload className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}