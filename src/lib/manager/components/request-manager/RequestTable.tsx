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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronDown, Trash2, XCircle, Eye, Lock, MoreVertical } from "lucide-react";
import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import managerService from "../../../../services/manager/manager.service";
import RequestDetail from "./RequestDetail";

interface Request {
  id: string;
  brand: string;
  email: string;
  description: string;
  status?: number;
  statusName?: string;
  createdAt: string;
  updatedAt: string;
  storeProfileCategoryName?: string;
  brandStatus?: number;
  brandId: number;
}

export default function RequestTableWithTabs() {
  const [activeTab, setActiveTab] = React.useState<
    "new" | "processed" | "closed"
  >("new");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedRequestId, setSelectedRequestId] = React.useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const itemsPerPage = 10;

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [isRejectReasonDialogOpen, setIsRejectReasonDialogOpen] =
    React.useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState<
    "accepted" | "rejected" | "deleted" | null
  >(null);
  const [dialogRequestId, setDialogRequestId] = React.useState<string | null>(
    null
  );
  const [closeRequestId, setCloseRequestId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState(
    "Rất tiếc, yêu cầu của bạn không đáp ứng được các tiêu chí hiện tại của chúng tôi."
  );

  React.useEffect(() => {
    const loadBrandRequests = async () => {
      const data = await managerService.fetchBrandRequests();
      const mappedData: Request[] = data.map((item) => ({
        id: item.brandRequest.id.toString(),
        brand: item.brandRequest.brandName,
        email: item.brandRequest.emailCustomer,
        description: item.brandRequest.description,
        status: item.brandRequest.status,
        statusName: item.brandRequest.statusName,
        createdAt: item.brandRequest.createdAt,
        updatedAt: item.brandRequest.updatedAt,
        storeProfileCategoryName:
          item.storeProfile?.storeProfileCategoryName || "Không xác định",
        brandStatus: item.brandRequest.brandStatus,
        brandId: item.brandRequest.brandId,
      }));

      setRequests(mappedData);
    };
    loadBrandRequests();
  }, []);

  const getFilteredData = () => {
    const data = requests;

    if (activeTab === "new") {
      return data
        .filter((item) => item.status === 0)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } else if (activeTab === "processed") {
      return data
        .filter((item) => item.status === 1 || item.status === 3)
        .sort((a, b) => b.id.localeCompare(a.id));
    } else {
      return data
        .filter((item) => item.status === 9)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (
    id: string,
    action: "accepted" | "rejected" | "deleted"
  ) => {
    setDialogRequestId(id);
    setDialogAction(action);
    setIsConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    if (!dialogRequestId || !dialogAction) return;

    if (dialogAction === "rejected") {
      setIsConfirmDialogOpen(false);
      setIsRejectReasonDialogOpen(true);
    } else {
      processAction(dialogRequestId, dialogAction);
    }
  };

  const processAction = async (
    requestIdStr: string,
    action: "accepted" | "rejected" | "deleted" | "closed",
    note?: string
  ) => {
    setIsLoading(true);
    const requestId = parseInt(requestIdStr);
    const newStatus = action === "accepted" ? 1 : action === "closed" ? 9 : 2;

    try {
      const request = requests.find((req) => req.id === requestIdStr);
      if (!request) {
        toast.error("Không tìm thấy yêu cầu", {
          position: "top-right",
          duration: 3000,
        });
        return;
      }

      if (action === "accepted") {
        console.log("Sending accept email for requestId:", requestId);
        const acceptEmailResult = await managerService.sendAcceptEmail(
          requestId,
          "Chúng tôi sẽ sớm liên hệ để hỗ trợ bạn với các bước tiếp theo."
        );
        if (!acceptEmailResult.success) {
          console.error(
            "Lỗi khi gửi email chấp nhận:",
            acceptEmailResult.message
          );
          toast.error(
            "Lỗi khi gửi email chấp nhận: " +
            (acceptEmailResult.message || "Không xác định"),
            { position: "top-right", duration: 3000 }
          );
          return;
        }

        console.log(
          "Calling updateBrandRequestStatus with requestId:",
          requestId,
          "newStatus:",
          newStatus
        );
        const updateRequestResult =
          await managerService.updateBrandRequestStatus(requestId, newStatus);
        if (!updateRequestResult.success) {
          console.error(
            "Lỗi khi cập nhật trạng thái yêu cầu:",
            updateRequestResult.message
          );
          toast.error(
            "Lỗi khi cập nhật trạng thái yêu cầu: " +
            (updateRequestResult.message || "Không xác định"),
            { position: "top-right", duration: 3000 }
          );
          return;
        }

        if (request.brandStatus === 0) {
          console.log(
            "Calling updateBrandStatus with brandId:",
            request.brandId
          );
          const updateBrandResult = await managerService.updateBrandStatus(
            request.brandId,
            1
          );
          if (!updateBrandResult.success) {
            console.warn(
              "Lỗi khi cập nhật trạng thái thương hiệu:",
              updateBrandResult.message
            );
          }
        }

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestIdStr
              ? {
                ...req,
                status: newStatus,
                statusName: "Chấp nhận",
                brandStatus: request.brandStatus === 0 ? 1 : req.brandStatus,
              }
              : req
          )
        );
        toast.success("Đã chấp nhận yêu cầu ID: " + requestIdStr, {
          position: "top-right",
          duration: 3000,
        });
      } else if (action === "rejected") {
        console.log("Sending reject email for requestId:", requestId);
        const rejectEmailResult = await managerService.sendRejectEmail(
          requestId,
          note!
        );
        if (!rejectEmailResult.success) {
          console.error(
            "Lỗi khi gửi email từ chối:",
            rejectEmailResult.message
          );
          toast.error(
            "Lỗi khi gửi email từ chối: " +
            (rejectEmailResult.message || "Không xác định"),
            { position: "top-right", duration: 3000 }
          );
          return;
        }

        console.log(
          "Calling updateBrandRequestStatus with requestId:",
          requestId,
          "newStatus:",
          newStatus
        );
        const updateRequestResult =
          await managerService.updateBrandRequestStatus(requestId, newStatus);
        if (!updateRequestResult.success) {
          console.error(
            "Lỗi khi cập nhật trạng thái yêu cầu:",
            updateRequestResult.message
          );
          toast.error(
            "Lỗi khi cập nhật trạng thái yêu cầu: " +
            (updateRequestResult.message || "Không xác định"),
            { position: "top-right", duration: 3000 }
          );
          return;
        }

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestIdStr
              ? {
                ...req,
                status: newStatus,
                statusName: "Từ chối",
              }
              : req
          )
        );
        toast.success("Đã từ chối yêu cầu ID: " + requestIdStr, {
          position: "top-right",
          duration: 3000,
        });
      } else if (action === "deleted") {
        console.log(
          "Calling updateBrandRequestStatus with requestId:",
          requestId,
          "newStatus:",
          newStatus
        );
        const result = await managerService.updateBrandRequestStatus(
          requestId,
          newStatus
        );
        if (!result.success) {
          console.error("Lỗi khi xóa yêu cầu:", result.message);
          toast.error(
            "Lỗi khi xóa yêu cầu: " + (result.message || "Không xác định"),
            { position: "top-right", duration: 3000 }
          );
          return;
        }

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestIdStr
              ? {
                ...req,
                status: newStatus,
                statusName: "Đã xóa",
              }
              : req
          )
        );
        toast.success("Đã xóa yêu cầu ID: " + requestIdStr, {
          position: "top-right",
          duration: 3000,
        });
      } else if (action === "closed") {
        console.log(
          "Calling updateBrandRequestStatus with requestId:",
          requestId,
          "newStatus:",
          newStatus
        );
        const result = await managerService.updateBrandRequestStatus(
          requestId,
          newStatus
        );
        if (!result.success) {
          console.error("Lỗi khi đóng yêu cầu:", result.message);
          toast.error(
            "Lỗi khi đóng yêu cầu: " + (result.message || "Không xác định"),
            { position: "top-right", duration: 3000 }
          );
          return;
        }

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestIdStr
              ? {
                ...req,
                status: newStatus,
                statusName: "Đã đóng",
              }
              : req
          )
        );
        toast.success("Đã đóng yêu cầu ID: " + requestIdStr, {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error handling action:", error);
      toast.error("Lỗi khi xử lý hành động", {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
      setIsRejectReasonDialogOpen(false);
      setIsCloseDialogOpen(false);
      setDialogRequestId(null);
      setDialogAction(null);
      setCloseRequestId(null);
      setRejectReason(
        "Rất tiếc, yêu cầu của bạn không đáp ứng được các tiêu chí hiện tại của chúng tôi."
      );
    }
  };

  const handleSubmitRejectReason = () => {
    if (!rejectReason.trim()) {
      toast.error("Lý do từ chối không được để trống", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    if (dialogRequestId && dialogAction) {
      processAction(dialogRequestId, dialogAction, rejectReason);
    }
  };

  const handleViewDetail = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRequestId(null);
  };

  const handleCloseRequest = (requestId: string) => {
    setCloseRequestId(requestId);
    setIsCloseDialogOpen(true);
  };

  const confirmCloseRequest = () => {
    if (closeRequestId) {
      processAction(closeRequestId, "closed");
    }
  };

  const ActionButton = ({ request }: { request: Request }) => {
    if (activeTab === "processed") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="text-foreground px-2 py-1">
              <MoreVertical className="h-5 w-5 hover:text-muted-foreground hover:scale-110 transition duration-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleViewDetail(request.id)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleCloseRequest(request.id)}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" /> Đóng yêu cầu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else if (activeTab === "closed") {
      return (
        <Button
          variant="link"
          className="text-blue-500 p-0 underline hover:text-blue-700"
          onClick={() => handleViewDetail(request.id)}
        >
          Xem chi tiết
        </Button>
      );
    }

    return (
      <Button
        variant="link"
        className="text-blue-500 p-0 underline hover:text-blue-700"
        onClick={() => handleViewDetail(request.id)}
      >
        Xem chi tiết
      </Button>
    );
  };

  const StatusButton = ({ request }: { request: Request }) => {
    if (activeTab === "processed") {
      return (
        <div className="flex gap-2">
          <Badge
            className={
              request.status === 1
                ? "bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
                : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
            }
          >
            Chấp nhận
          </Badge>
        </div>
      );
    } else if (activeTab === "closed") {
      return (
        <div className="flex gap-2">
          <Badge
            className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
          >
            Đã đóng
          </Badge>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="w-[90px] px-2 h-7 text-sm">
            Xử lý
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => handleAction(request.id, "accepted")}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" /> Chấp nhận
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction(request.id, "rejected")}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" /> Từ chối
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction(request.id, "deleted")}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-4 relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "new" ? "default" : "outline"}
            onClick={() => setActiveTab("new")}
          >
            YÊU CẦU MỚI
          </Button>
          <Button
            variant={activeTab === "processed" ? "default" : "outline"}
            onClick={() => setActiveTab("processed")}
          >
            ĐÃ XỬ LÝ
          </Button>
          <Button
            variant={activeTab === "closed" ? "default" : "outline"}
            onClick={() => setActiveTab("closed")}
          >
            ĐÃ ĐÓNG
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">ID</TableHead>
            <TableHead className="w-[20%]">Thương hiệu</TableHead>
            <TableHead className="w-[20%]">Email khách hàng</TableHead>
            <TableHead className="w-[20%]">Loại cửa hàng</TableHead>
            <TableHead className="w-[12%]">
              {activeTab === "processed" ? "Thao tác" : "Xem chi tiết"}
            </TableHead>
            <TableHead className="w-[8%]">
              {activeTab === "new" ? "Hành động" : "Trạng thái"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>
                {request.brand}
                {request.brandStatus === 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-300 hover:bg-red-200 dark:hover:bg-red-400 text-xs">
                    new
                  </Badge>
                )}
              </TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>
                {request.storeProfileCategoryName || "Không xác định"}
              </TableCell>
              <TableCell>
                <ActionButton request={request} />
              </TableCell>
              <TableCell>
                <StatusButton request={request} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {selectedRequestId && (
        <RequestDetail
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          brandRequestId={parseInt(selectedRequestId)}
        />
      )}

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hành động</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn{" "}
              <strong>
                {dialogAction === "accepted"
                  ? "chấp nhận"
                  : dialogAction === "rejected"
                    ? "từ chối"
                    : "xóa"}
              </strong>{" "}
              yêu cầu ID: {dialogRequestId} không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isRejectReasonDialogOpen}
        onOpenChange={setIsRejectReasonDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lý do từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="mt-2 min-h-[100px]"
                required
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitRejectReason}>
              Gửi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isCloseDialogOpen}
        onOpenChange={setIsCloseDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đóng yêu cầu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn <strong>đóng</strong> yêu cầu ID: {closeRequestId} không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseRequest}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
}