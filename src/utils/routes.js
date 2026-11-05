export const ROUTES = {
  BASE: "/",
  HEALTH: "/health",
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
    ME: "/me",
    LOGOUT: "/logout",
  },
  DOCTORS: {
    ROOT: "/doctors",
    BASE: "/",
    FILTERS: "/filters",
    BY_ID: "/:id",
  },
  PATIENTS: {
    ROOT: "/patients",
    BASE: "/",
    CONDITIONS: "/conditions",
    BY_ID: "/:id",
  },
  ANALYTICS: {
    ROOT: "/analytics",
    BASE: "/",
    DASHBOARD: "/dashboard",
  },
};

export default ROUTES;
