import React from 'react';

import { AuthProvider } from './auth';
import { UploadProvider } from './upload'
import { SearchProvider } from './search'
import { FollowProvider } from './follow';
import { FeedProvider } from './feed';

const Providers = ({children}) => {
  return (
    <AuthProvider>
      <UploadProvider>
        <SearchProvider>
          <FollowProvider>
            <FeedProvider>
              {children}
            </FeedProvider>
          </FollowProvider>
        </SearchProvider>
      </UploadProvider>
    </AuthProvider>
  )
}

export default Providers;