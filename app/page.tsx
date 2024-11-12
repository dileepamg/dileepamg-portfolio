import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    
    <div className="h-screen flex items-center justify-center text-3xl">
      <div className="flex-col leading-8">
        <div className="my-8">
          <Button variant="ghost" size="lg">Hello</Button>
          <Button variant="ghost" size="lg">It&apos;s</Button>
          <Button variant="ghost" size="lg">Me</Button>
          <Button variant="ghost" size="lg">Dileepa</Button> 
        </div>
        <div className="text-center text-indigo-300 text-sm">
          dileepa@elements.lk
        </div>
      </div>
     
         
    </div>
    
  );
}
