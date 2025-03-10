import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialDistricts = [
  { id: 1, name: 'Lê Trần Cát Lâm', district: 'Quận 1', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Đang làm' },
  { id: 2, name: 'Lê Nguyễn Gia Bảo', district: 'Quận 12', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Tạm dừng' },
  { id: 3, name: 'Đinh Văn Phong', district: 'Quận 3', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Tạm dừng' },
  { id: 4, name: 'Nguyễn Kỳ Anh Minh', district: 'Quận 4', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Đang làm' },
  { id: 5, name: 'Phùi Chếch Minh', district: 'Quận Phú Nhuận', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Đang làm' },
  { id: 6, name: 'Trần Văn An', district: 'Quận Gò Vấp', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Đang làm' },
  { id: 7, name: 'Nguyễn Thị Bình', district: 'Quận 7', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Tạm dừng' },
  { id: 8, name: 'Phạm Hoàng Long', district: 'Quận Bình Thạnh', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Đang làm' },
  { id: 9, name: 'Võ Thị Mai', district: 'Quận 9', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Đang làm' },
  { id: 10, name: 'Hoàng Minh Tuấn', district: 'Quận Bình Tân', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Tạm dừng' }
];

const UserManagement = () => {
  const [districts, setDistricts] = React.useState(initialDistricts);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedDistrict, setSelectedDistrict] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const itemsPerPage = 5;

  const handleStatusClick = (district) => {
    setSelectedDistrict(district);
    setDialogOpen(true);
  };

  const handleStatusChange = () => {
    setDistricts(prevDistricts =>
      prevDistricts.map(d => {
        if (d.id === selectedDistrict.id) {
          return {
            ...d,
            status: d.status === 'Đang làm' ? 'Tạm dừng' : 'Đang làm'
          };
        }
        return d;
      })
    );
    setDialogOpen(false);
  };

  const totalPages = Math.ceil(districts.length / itemsPerPage);
  const currentItems = districts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">QUẢN LÝ KHU VỰC</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[23%]">Tên</TableHead>
                <TableHead className="w-[17%]">Khu vực</TableHead>
                {/* <TableHead className="w-[15%]">Thành phố</TableHead> */}
                <TableHead className="w-[12%]">Số điện thoại</TableHead>
                <TableHead className="w-[20%]">Email</TableHead>
                <TableHead className="w-[10%]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((district) => (
                <TableRow key={district.id}>
                  <TableCell>{district.name}</TableCell>
                  <TableCell>{district.district}</TableCell>
                  {/* <TableCell>{district.location}</TableCell> */}
                  <TableCell>{district.phone}</TableCell>
                  <TableCell>{district.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`w-20 justify-center cursor-pointer ${district.status === 'Đang làm' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                        } text-white`}
                      onClick={() => handleStatusClick(district)}
                    >
                      {district.status}
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn thay đổi trạng thái của {selectedDistrict?.name} từ {selectedDistrict?.status} thành {selectedDistrict?.status === 'Đang làm' ? 'Tạm dừng' : 'Đang làm'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserManagement;