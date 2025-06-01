import Image from "next/image";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function CongratulationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Change password successfully</CardTitle>
        <CardDescription>
            Your password has been changed successfully. You can now log in with your new password.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <Image src={"/success.jpg"} alt="Success" width={200} height={200}/>
      </CardContent>
      <CardFooter>
        <Button className="w-full h-10" type="submit" onClick={() => {
          window.location.href = "/login";
        }
        }>
            Go to login
        </Button>
      </CardFooter>
    </Card>
  );
}
