import * as React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { AuthLinks } from "../auth/components/AuthLink";
import logo from "/images/logo-site-plus/logo.png";

export function MobileNavigationMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>
            <Link to="/" className="flex items-center w-24 h-10">
              <img src={logo} alt="SitePlus Logo" className="h-auto w-full" />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6">
          {/* Language and Notifications */}
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Auth Links */}
          <div className="flex flex-col gap-2">
            <AuthLinks />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/home-page"
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              Trang chủ
            </Link>

            <Accordion type="single" collapsible>
              <AccordionItem value="strategic-consulting">
                <AccordionTrigger className="px-4">
                  Tư Vấn Chiến Lược
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 pl-6">
                    <Link
                      to="/khao-sat-tim-mat-bang"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Khảo sát tìm mặt bằng
                    </Link>
                    <Link
                      to="/khao-sat-mat-bang-cua-ban"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Khảo sát mặt bằng của bạn
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              to="/giai-phap"
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              Giới Thiệu
            </Link>
            <Link
              to="/khoa-sat-cua-ban"
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              Khảo Sát Của Bạn
            </Link>
            <Link
              to="/contactpage"
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              Liên Hệ
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}