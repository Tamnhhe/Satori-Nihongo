import dayjs from 'dayjs';
import { IUserProfile } from 'app/shared/model/user-profile.model';
import { AuthProvider } from 'app/shared/model/enumerations/auth-provider.model';

export interface ISocialAccount {
  id?: number;
  provider?: keyof typeof AuthProvider;
  providerUserId?: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenExpiry?: dayjs.Dayjs | null;
  userProfile?: IUserProfile | null;
}

export const defaultValue: Readonly<ISocialAccount> = {};
