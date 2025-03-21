import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button"; // Đảm bảo import Button

interface Request {
  id: string;
  brand: string;
  email: string;
  location: string; // Vị trí khảo sát trong TP.HCM
  status: "in-progress" | "done"; // Giữ nguyên trạng thái
}

const processedData: Request[] = [
  { id: "AB129", brand: "Highlands Coffee", email: "contact@highlands.vn", location: "Quận 1, TP.HCM", status: "in-progress" },
  { id: "CD125", brand: "The Coffee House", email: "info@tch.vn", location: "Quận 7, TP.HCM", status: "done" },
  { id: "AB126", brand: "Starbucks", email: "vn@starbucks.com", location: "Quận 3, TP.HCM", status: "done" },
  { id: "CD127", brand: "Phúc Long", email: "support@phuclong.vn", location: "Quận 10, TP.HCM", status: "in-progress" },
  { id: "EF128", brand: "Trung Nguyên", email: "contact@trungnguyen.vn", location: "Bình Thạnh, TP.HCM", status: "done" },
  { id: "GH130", brand: "Cộng Cà Phê", email: "info@congcafe.vn", location: "Quận 5, TP.HCM", status: "in-progress" },
  { id: "IJ131", brand: "The Coffee Shop", email: "contact@coffeeshop.vn", location: "Quận 9, TP.HCM", status: "done" },
  { id: "KL132", brand: "Nescafé", email: "vn@nescafe.com", location: "Quận Gò Vấp, TP.HCM", status: "in-progress" },
  { id: "MN133", brand: "Lavazza", email: "support@lavazza.vn", location: "Quận Bình Tân, TP.HCM", status: "done" },
  { id: "OP134", brand: "Illy", email: "contact@illy.vn", location: "Quận Thủ Đức, TP.HCM", status: "in-progress" },
];

type FilterStatus = "all" | "in-progress" | "done";

const filterLabels = {
  all: "Tất cả",
  "in-progress": "Đang tiến hành",
  done: "Hoàn thành",
};

export default function ProcessedRequests() {
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const getFilteredData = () => {
    let data = processedData;
    if (filterStatus !== "all") {
      data = processedData.filter(item => item.status === filterStatus);
    }
    return data;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">Yêu cầu cần khảo sát</div>
        <Select
          value={filterStatus}
          onValueChange={(value: FilterStatus) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent className="border border-gray-300 rounded-md shadow-sm">
            {Object.entries(filterLabels).map(([key, label]) => (
              <SelectItem key={key} value={key} className="hover:bg-gray-100">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">Mã yêu cầu</TableHead>
            <TableHead className="w-[20%]">Thương hiệu</TableHead>
            <TableHead className="w-[20%]">Email</TableHead>
            <TableHead className="w-[20%]">Vị trí khảo sát</TableHead>
            <TableHead className="w-[12%]">Xem chi tiết</TableHead>
            <TableHead className="w-[8%]">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.brand}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.location}</TableCell>
              <TableCell>
                <Button variant="link" className="text-blue-500 p-0 underline hover:text-blue-700">
                  Xem chi tiết
                </Button>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    request.status === "done"
                      ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 w-28 h-6 justify-center px-2 text-xs text-white rounded-md whitespace-nowrap"
                      : "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 w-28 h-6 justify-center px-2 text-xs text-white rounded-md whitespace-nowrap"
                  }
                >
                  {request.status === "done" ? "Hoàn thành" : "Đang tiến hành"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}