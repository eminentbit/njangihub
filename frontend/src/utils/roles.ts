const getRoleName = (role?: string): string => {
  switch (role) {
    case "admin":
      return "admin";
    case "member":
      return "user";
    case "bod":
      return "board";
    default:
      return role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
  }
};

export default getRoleName;
