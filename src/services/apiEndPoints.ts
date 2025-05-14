const url = process.env.NEXT_PUBLIC_BACKEND_END;
console.log(url, "this is url");
const API_END_POINTS = {
  // Custom Methods
  // Standard Methods
  login: `${url}/api/method/vms.APIs.authentication_api.login.login`,
};

export default API_END_POINTS;
