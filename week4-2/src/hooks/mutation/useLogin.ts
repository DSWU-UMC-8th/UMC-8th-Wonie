import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { UserSigninInformation } from "../../utils/validate";

const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (values: UserSigninInformation) => login(values),
  });
};

export default useLogin;
