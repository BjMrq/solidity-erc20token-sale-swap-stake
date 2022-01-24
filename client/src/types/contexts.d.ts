import { User, AuthToken } from "types";

// AuthContext ///

// State
export type AuthContextState = {
  user: {
    uuid: string;
    email: string;
    profilePicture: string;
  };
  isAuthenticated: boolean;
};

// Functions
export type Login = ({ user }: { user: User }) => void;

export type SetToken = ({
  user,
  token,
}: {
  user: User;
  token: AuthToken;
}) => void;

export type RemoveUserCookie = () => void;

export type UnsetToken = () => void;

export type LogOut = ({
  tokenToRevoke,
  logOutUser,
  authToken,
}: {
  tokenToRevoke?: string;
  logOutUser?: boolean;
  authToken?: string;
}) => Promise<void>;

// AuthContext
export type AuthContextType = AuthContextState & {
  logIn: Login;
  logOut: LogOut;
};
