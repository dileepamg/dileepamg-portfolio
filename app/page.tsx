import { Button } from "@/components/ui/button"

export default function Home() {
  return (

    <div className="h-screen flex flex-col items-center justify-center text-3xl bg-gradient-to-r from-slate-900 to-slate-700">

      <div className="my-8">
        <Button variant="ghost" size="lg" className="bg-gradient-to-r from-green-200 to-blue-500 text-transparent bg-clip-text hover:text-white transition duration-500 hover:scale-125">Hello!</Button>
      </div>
      <div className="text-center text-slate-300 text-md">
        <p className="text-xl mb-2">Reach Me</p>
        <a href="mailto:dileepa@elements.lk">dileepa@elements.lk</a>
      </div>


    </div>

  );
}
