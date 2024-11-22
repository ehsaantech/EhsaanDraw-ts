import React, { createContext, useState, useContext, ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';
import { getAdditionalUserInfo } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebaseConfig';

interface GithubContextType {
  githubId: string | null;
  screenName: string | null;
  photoUrl: string | null;
  isLoading: boolean;
  handleGithubLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const GithubContext = createContext<GithubContextType | undefined>(undefined);

const GithubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [githubId, setGithubId] = useState<string | null>(() => {
    const storedId = localStorage.getItem('github_Id');
    return storedId ? (storedId) : null;
  });

  const [screenName, setScreenName] = useState<string | null>(() => {
    const storedScreenName = localStorage.getItem('github_ScreenName');
    return storedScreenName ? (storedScreenName) : null;
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    const storedPhotoUrl = localStorage.getItem('github_PhotoUrl');
    return storedPhotoUrl ? (storedPhotoUrl) : null;
  });

  const handleGithubLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const githubUser = result?.user?.uid;
      const additionalUserInfo = getAdditionalUserInfo(result);
      const screenName = additionalUserInfo?.profile?.login as string;
      const photoUrl = additionalUserInfo?.profile?.avatar_url as string;
      logEvent(analytics, "login", {
        user_id: githubUser,
        provider: "GitHub",
        screen_name: screenName,
      });

      localStorage.setItem('github_Id', (githubUser));
      localStorage.setItem('github_ScreenName', (screenName));
      localStorage.setItem('github_PhotoUrl',(photoUrl));

      setGithubId(githubUser);
      setScreenName(screenName);
      setPhotoUrl(photoUrl);
     
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear localStorage and state
      localStorage.removeItem('github_Id');
      localStorage.removeItem('github_ScreenName');
      localStorage.removeItem('github_PhotoUrl');
      setIsLoading(false);
      setGithubId(null);
      setScreenName(null);
      setPhotoUrl(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GithubContext.Provider value={{ githubId, screenName, photoUrl, isLoading, handleGithubLogin, logout }}>
      {children}
    </GithubContext.Provider>
  );
};

const useGithub = (): GithubContextType => {
  const context = useContext(GithubContext);
  if (context === undefined) {
    throw new Error('useGithub must be used within a GithubProvider');
  }
  return context;
};

export { GithubProvider, useGithub };
