import React from 'react'
import { Separator } from "@/components/ui/separator"	
import Image from 'next/image'
import { Button } from '../ui/button';


type EditAvatarProps = {
    ref: React.RefObject<HTMLInputElement | null>;
    name: string;
    avatarHint: string; // Hint for the avatar
  };


export default function EditAvatarSection({ ref, name,avatarHint }: EditAvatarProps) {

    const [avatar, setAvatar] = React.useState<string | null>(null); // State to hold the avatar URL

    const handleButtonClick = () => {
        ref.current?.click(); // Trigger file input click
      };
    
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get selected file safely
        if (file) {
          console.log(ref.current?.files?.[0]); // Log the file object for debugging
          setAvatar(URL.createObjectURL(file)); // Create a URL for the selected file
        }
      };


  return (
    <div className="flex flex-row gap-4 items-center">
          {/* Just avatar display */}
            <div className="relative ring-primary ring-offset-base-100 size-40 rounded-full ring ring-offset-2">
              <Image
                alt="Avatar"
                fill
                className="object-cover  rounded-full"
                src={avatar || "https://randomuser.me/api/portraits/men/1.jpg"} // Use the avatar URL or a default image
              />
            </div>
          {/* Change avatar button */}
          <div className="flex flex-col items-center gap-4">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={ref}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Clickable Button */}
      <Button variant="outline" onClick={handleButtonClick} className="btn btn-primary w-fit">
        {name}
      </Button>
    </div>
          <Separator orientation="vertical" className="!w-1 !bg-primary" />
          {/* Avatar hint */}
          <p className="whitespace-pre-line body-sm">{avatarHint}</p>
        </div>
  )
}
