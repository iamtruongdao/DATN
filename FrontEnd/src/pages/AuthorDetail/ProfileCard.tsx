import ProfileSkeleton from '@/components/Skeleton/ProfileSkeleton'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Author } from '@/types'
import React from 'react'
type ProfileProp = {
  author: Author
}
const ProfileCard: React.FC<ProfileProp> = ({ author }) => {
  return (
    <>
      {!author ? (
        <ProfileSkeleton />
      ) : (
        <Card className='max-w-4xl bg-white border-none  mx-auto py-9 shadow-none   '>
          <div className='flex  !space-x-4'>
            <Avatar className='w-40 h-40 shrink-0'>
              <AvatarImage src={author?.avatar} alt='User Avatar' />
            </Avatar>
            <div className='flex-grow'>
              <h2 className='text-xl font-semibold text-green-700 !mb-2'>{author?.authorName}</h2>
              <p dangerouslySetInnerHTML={{ __html: author.authorDescription }} className='text-gray-600 text-base'></p>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}

export default ProfileCard
