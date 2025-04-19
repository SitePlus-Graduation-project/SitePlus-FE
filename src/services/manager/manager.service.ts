import axios from "axios";
import { API_BASE_URL } from "../api-config";
import { API_ENDPOINTS } from "../api-endpoints";
import toast from "react-hot-toast";

// User interface 
interface User {
  id: number;
  email: string;
  name: string;
  roleName: string;
  areaName: string;
  districtName: string;
  cityName: string;
  status: number;
  statusName: string;
  createdAt: string;
}

// BrandRequest interfaces
interface StoreProfileCriteria {
  id: number;
  storeProfileId: number;
  attributeId: number;
  attributeName: string;
  maxValue: string;
  minValue: string;
  defaultValue: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreProfile {
  id: number;
  brandId: number;
  storeProfileCategoryId: number;
  storeProfileCategoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandRequestStoreProfile {
  id: number;
  storeProfileId: number;
  brandRequestId: number;
}

interface BrandRequest {
  id: number;
  brandId: number;
  brandName: string;
  nameCustomer: string;
  emailCustomer: string;
  phoneCustomer: string;
  addressCustomer: string;
  status: number;
  statusName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  brandStatus: number;
  brandStatusName: string;
  customerSegments: string[];
  industryCategories: string[];
}

interface BrandRequestResponse {
  brandRequest: BrandRequest;
  brandRequestStoreProfile: BrandRequestStoreProfile;
  storeProfile: StoreProfile;
  storeProfileCriteria: StoreProfileCriteria[];
}

// Interface cho kết quả tìm kiếm bằng AI (API mới)
export interface SearchAIProject {
  siteId: number;
  siteDealId: number;
  address: string;
  size: number;
  leaseTerm: string;
  proposedPrice: number;
  deposit: number;
  additionalTerms: string;
  imageUrl: string;
  totalScore: number;
  nameSite?: string;
}

interface SearchAIResponse {
  status: string;
  message: string;
  requestId: number;
  data: SearchAIProject[];
}

// Interface cho response của API cập nhật status
interface UpdateStatusResponse {
  success: boolean;
  message: string;
  messageQdrant?: string;
  totalCount: number;
}

// Interface cho response của API update matched site
interface UpdateMatchedSiteResponse {
  success: boolean;
  message: string;
}

// Interface cho response của API send email
interface SendEmailResponse {
  data: string;
  success: boolean;
  message: string;
  totalCount: number;
}

// Interface cho response của API fetchFavorites (danh sách quan tâm)
export interface FavoriteSiteResponse {
  id: number;
  buildingName: string;
  siteCategoryName: string;
  area: string;
  address: string;
  size: number;
  floor: number;
  description: string;
  statusName: string;
  imageUrl: string;
  proposedPrice: number;
  leaseTerm: string;
  deposit: number;
  additionalTerms: string;
  depositMonth: string;
}

// Interface cho response của API lấy danh sách favorites
interface FetchFavoritesResponse {
  data: {
    closedSites: any[];
    matchedSites: FavoriteSiteResponse[]; // Sửa từ SearchAIProject[] thành FavoriteSiteResponse[]
  };
  success: boolean;
  message: string;
  totalCount: number;
}

interface FetchUsersParams {
  search?: string;
}

// Interface cho hình ảnh của site
interface SiteImage {
  id: number;
  url: string;
}

// Interface cho building của site
interface SiteBuilding {
  id: number;
  name: string;
  areaId: number;
  status: string;
}

// Interface cho site
interface Site {
  id: number;
  buildingId?: number;
  buildingName?: string;
  siteCategoryId: number;
  siteCategoryName: string;
  address: string;
  size: number;
  floor: number;
  totalFloor: number;
  description: string;
  status: number;
  statusName: string;
  areaId: number;
  areaName?: string;
  districtName?: string;
  building?: SiteBuilding;
  images: SiteImage[];
  createdAt: string;
  updatedAt: string;
}

// Interface cho response của API GET_SITES
interface SitesApiResponse {
  data: {
    page: number;
    totalPage: number;
    totalRecords: number;
    currentPageCount: number;
    listData: Site[];
  };
  success: boolean;
  message: string;
  totalCount: number;
}

// API Response interface for Brand Requests (danh sách)
interface BrandRequestApiResponse {
  data: BrandRequestResponse[];
  success: boolean;
  message: string;
}

// API Response interface for Brand Request by ID (chi tiết)
interface BrandRequestDetailApiResponse {
  data: BrandRequestResponse;
  success: boolean;
  totalCount: number;
  message?: string;
}

// API Response interface for Users
interface UserApiResponse {
  data: {
    page: number;
    totalPage: number;
    totalRecords: number;
    listData: User[];
  };
  success: boolean;
  message: string;
}

class ManagerService {
  private getAuthHeader(isPatch: boolean = false): { headers: Record<string, string> } | null {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn", { position: "top-left", duration: 3000 });
      return null;
    }

    return {
      headers: {
        "Content-Type": isPatch ? "application/json-patch+json" : "application/json",
        "Authorization": `Bearer ${token}`,
        "accept": "*/*",
      },
    };
  }

  async fetchUsers(params: FetchUsersParams = {}): Promise<User[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    const { search } = params;

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("pageSize", "1000");
      if (search) queryParams.append("search", search);

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_USERS}?${queryParams.toString()}`,
        authHeader
      );

      console.log("API Response for Users:", response.data);
      const data: UserApiResponse = response.data;
      if (data.success) {
        let allUsers: User[] = [...data.data.listData];
        const totalPages = data.data.totalPage;

        if (totalPages > 1) {
          const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
          const pagePromises = pages.map((pageNum) => {
            const pageQueryParams = new URLSearchParams();
            pageQueryParams.append("page", pageNum.toString());
            pageQueryParams.append("pageSize", "1000");
            if (search) pageQueryParams.append("search", search);

            return axios
              .get(
                `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_USERS}?${pageQueryParams.toString()}`,
                authHeader
              )
              .then((res) => {
                console.log(`Page ${pageNum} Response for Users:`, res.data);
                return res.data.data.listData as User[];
              })
              .catch((error) => {
                console.error(`Error fetching page ${pageNum}:`, error);
                return [];
              });
          });

          const additionalUsers = (await Promise.all(pagePromises)).flat() as User[];
          allUsers = allUsers.concat(additionalUsers);
        }

        const uniqueUsers = Array.from(
          new Map(allUsers.map(user => [user.id, user])).values()
        );

        console.log(`Fetched ${allUsers.length} users, ${uniqueUsers.length} unique users`);
        return uniqueUsers;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi tải danh sách nhân viên", { position: "top-left", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Users:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return [];
    }
  }

  async fetchBrandRequests(): Promise<BrandRequestResponse[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("pageSize", "1000");

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_BRAND_REQUESTS}?${queryParams.toString()}`,
        authHeader
      );

      console.log("API Response for Brand Requests:", response.data);
      const data: BrandRequestApiResponse = response.data;
      if (data.success) {
        const allBrandRequests: BrandRequestResponse[] = [...data.data];

        const uniqueBrandRequests = Array.from(
          new Map(allBrandRequests.map(item => [item.brandRequest.id, item])).values()
        );

        console.log(`Fetched ${allBrandRequests.length} brand requests, ${uniqueBrandRequests.length} unique brand requests`);
        return uniqueBrandRequests;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi tải danh sách yêu cầu thương hiệu", { position: "top-left", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Brand Requests:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return [];
    }
  }

  async fetchBrandRequestById(brandRequestId: number): Promise<BrandRequestResponse | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_BRAND_REQUEST_BY_ID}`.replace(":brandRequestId", brandRequestId.toString());
      const response = await axios.get(endpoint, authHeader);

      console.log("API Response for Brand Request by ID:", response.data);
      const data: BrandRequestDetailApiResponse = response.data;
      if (data.success) {
        return data.data;
      } else {
        console.log("API Error: Success is false", data.message || "No message provided");
        toast.error(data.message || "Lỗi khi tải chi tiết yêu cầu thương hiệu", { position: "top-left", duration: 3000 });
        return null;
      }
    } catch (error) {
      console.error("API Error for Brand Request by ID:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return null;
    }
  }

  async searchByAI(requestId: number, limit: number = 6): Promise<SearchAIProject[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("requestId", requestId.toString());
      queryParams.append("limit", limit.toString());

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.POST.SEARCH_BY_AI}?${queryParams.toString()}`,
        {},
        authHeader
      );

      console.log("API Response for Search by AI:", response.data);
      const data: SearchAIResponse = response.data;
      if (data.status === "ok" && data.data) {
        return data.data;
      } else {
        console.log("API Error: Status is not ok", data.status);
        toast.error(data.message || "Không tìm thấy kết quả từ AI", { position: "top-left", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Search by AI:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return [];
    }
  }

  async updateBrandRequestStatus(requestId: number, status: number): Promise<UpdateStatusResponse> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return {
        success: false,
        message: "Không có quyền truy cập",
        messageQdrant: "",
        totalCount: 0,
      };
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.PUT.UPDATE_BRAND_REQUEST_STATUS}`.replace(":id", requestId.toString());
      const body = {
        status: status,
        updateAt: new Date().toISOString(),
      };

      const response = await axios.put(endpoint, body, authHeader);

      console.log("API Response for Update Status:", response.data);
      const data: UpdateStatusResponse = response.data;
      return data;
    } catch (error) {
      console.error("API Error for Update Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return {
        success: false,
        message: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Lỗi không xác định",
        messageQdrant: "",
        totalCount: 0,
      };
    }
  }

  async updateMatchedSite(requestId: number, siteDealId: number, score: number): Promise<boolean> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return false;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("requestId", requestId.toString());
      queryParams.append("siteDealId", siteDealId.toString());
      queryParams.append("score", score.toString());

      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.PUT.UPDATE_MATCHED_SITE}?${queryParams.toString()}`,
        {},
        authHeader
      );

      console.log("API Response for Update Matched Site:", response.data);
      const data: UpdateMatchedSiteResponse = response.data;
      if (data.success) {
        return true;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi thêm site vào kho quan tâm", { position: "top-left", duration: 3000 });
        return false;
      }
    } catch (error) {
      console.error("API Error for Update Matched Site:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return false;
    }
  }

  async updateSiteStatus(siteId: number, status: number): Promise<boolean> {
    const authHeader = this.getAuthHeader(true);
    if (!authHeader) {
      return false;
    }

    try {
      const body = {
        siteId: siteId,
        status: status,
      };

      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.PATCH.UPDATE_SITE_STATUS}`,
        body,
        authHeader
      );

      console.log("API Response for Update Site Status:", response.data);
      const data: UpdateStatusResponse = response.data;
      if (data.success) {
        return true;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi cập nhật status của site", { position: "top-left", duration: 3000 });
        return false;
      }
    } catch (error) {
      console.error("API Error for Update Site Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return false;
    }
  }

  async fetchFavorites(requestId: number): Promise<FetchFavoritesResponse> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return {
        data: {
          closedSites: [],
          matchedSites: [],
        },
        success: false,
        message: "Không có quyền truy cập",
        totalCount: 0,
      };
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_FAVORITES}`.replace(":requestId", requestId.toString());
      const response = await axios.get(endpoint, authHeader);

      console.log("API Response for Fetch Favorites:", response.data);
      const data: FetchFavoritesResponse = response.data;
      if (data.success) {
        return data;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi tải danh sách quan tâm", { position: "top-left", duration: 3000 });
        return {
          data: {
            closedSites: [],
            matchedSites: [],
          },
          success: false,
          message: data.message || "Lỗi khi tải danh sách quan tâm",
          totalCount: 0,
        };
      }
    } catch (error) {
      console.error("API Error for Fetch Favorites:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
          localStorage.removeItem("token");
        } else if (error.response?.status === 404) {
          return {
            data: {
              closedSites: [],
              matchedSites: [],
            },
            success: false,
            message: "Không tìm thấy danh sách quan tâm",
            totalCount: 0,
          };
        } else {
          toast.error(
            "Lỗi kết nối API: " + (error.response?.data?.message || error.message),
            { position: "top-left", duration: 3000 }
          );
        }
      } else {
        toast.error("Lỗi kết nối API: Không xác định", { position: "top-left", duration: 3000 });
      }
      return {
        data: {
          closedSites: [],
          matchedSites: [],
        },
        success: false,
        message: "Lỗi khi tải danh sách quan tâm",
        totalCount: 0,
      };
    }
  }

  async exportPDF(brandRequestId: number): Promise<Blob | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.EXPORT_PDF}`.replace(":brandRequestId", brandRequestId.toString());
      const response = await axios.get(endpoint, {
        ...authHeader,
        responseType: "blob",
      });

      console.log("API Response for Export PDF:", response);
      return response.data;
    } catch (error) {
      console.error("API Error for Export PDF:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi khi xuất PDF: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return null;
    }
  }

  async fetchSites(pageNumber: number = 1, pageSize: number = 6, status?: number): Promise<SitesApiResponse> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return {
        data: {
          page: 1,
          totalPage: 1,
          totalRecords: 0,
          currentPageCount: 0,
          listData: [],
        },
        success: false,
        message: "Không có quyền truy cập",
        totalCount: 0,
      };
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("pageNumber", pageNumber.toString());
      queryParams.append("pageSize", pageSize.toString());
      if (status !== undefined) {
        queryParams.append("status", status.toString());
      }

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_SITES}?${queryParams.toString()}`,
        authHeader
      );

      console.log("API Response for Fetch Sites:", response.data);
      const data: SitesApiResponse = response.data;
      return data;
    } catch (error) {
      console.error("API Error for Fetch Sites:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return {
        data: {
          page: 1,
          totalPage: 1,
          totalRecords: 0,
          currentPageCount: 0,
          listData: [],
        },
        success: false,
        message: "Lỗi khi tải danh sách site",
        totalCount: 0,
      };
    }
  }

  async updateBrandStatus(brandId: number, status: number): Promise<UpdateStatusResponse> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return {
        success: false,
        message: "Không có quyền truy cập",
        messageQdrant: "",
        totalCount: 0,
      };
    }

    try {
      // Sửa cách tạo URL: Bỏ "/" trong phần thay thế
      const baseEndpoint = API_ENDPOINTS.MANAGER.PUT.UPDATE_BRAND_STATUS; // "/api/Brand/StatusBrand/:id"
      const endpoint = `${API_BASE_URL}${baseEndpoint.replace(":id", brandId.toString())}`;
      console.log("Generated endpoint:", endpoint); // Log để kiểm tra URL

      // Chỉ gửi status trong body
      const body = {
        status: status,
      };

      const response = await axios.put(endpoint, body, authHeader);

      console.log("API Response for Update Brand Status:", response.data);
      const data: UpdateStatusResponse = response.data;
      if (data.success) {
        // toast.success(data.message || "Cập nhật trạng thái brand thành công!", { position: "top-left", duration: 3000 });
      } else {
        toast.error(data.message || "Lỗi khi cập nhật trạng thái brand", { position: "top-left", duration: 3000 });
      }
      return data;
    } catch (error) {
      console.error("API Error for Update Brand Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return {
        success: false,
        message: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Lỗi không xác định",
        messageQdrant: "",
        totalCount: 0,
      };
    }
  }

  async sendAcceptEmail(requestId: number, note: string): Promise<SendEmailResponse> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return {
        data: "",
        success: false,
        message: "Không có quyền truy cập",
        totalCount: 0,
      };
    }

    try {
      const body = {
        id: requestId,
        note: note,
      };

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.POST.SEND_ACCEPT_EMAIL}`,
        body,
        authHeader
      );

      console.log("API Response for Send Accept Email:", response.data);
      const data: SendEmailResponse = response.data;
      if (data.success) {
        // toast.success(data.message || "Gửi email chấp nhận thành công!", { position: "top-left", duration: 3000 });
      } else {
        toast.error(data.message || "Lỗi khi gửi email chấp nhận", { position: "top-left", duration: 3000 });
      }
      return data;
    } catch (error) {
      console.error("API Error for Send Accept Email:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return {
        data: "",
        success: false,
        message: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Lỗi không xác định",
        totalCount: 0,
      };
    }
  }

  async sendRejectEmail(requestId: number, note: string): Promise<SendEmailResponse> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return {
        data: "",
        success: false,
        message: "Không có quyền truy cập",
        totalCount: 0,
      };
    }

    try {
      const body = {
        id: requestId,
        note: note,
      };

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.POST.SEND_REJECT_EMAIL}`,
        body,
        authHeader
      );

      console.log("API Response for Send Reject Email:", response.data);
      const data: SendEmailResponse = response.data;
      if (data.success) {
        // toast.success(data.message || "Gửi email từ chối thành công!", { position: "top-left", duration: 3000 });
      } else {
        toast.error(data.message || "Lỗi khi gửi email từ chối", { position: "top-left", duration: 3000 });
      }
      return data;
    } catch (error) {
      console.error("API Error for Send Reject Email:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return {
        data: "",
        success: false,
        message: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Lỗi không xác định",
        totalCount: 0,
      };
    }
  }
}

const managerService = new ManagerService();
export default managerService;