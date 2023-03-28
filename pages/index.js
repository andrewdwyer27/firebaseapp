import toast from "react-hot-toast";

export default function Home() {
  function handleClick() {
    toast.success("Hello toast");
  }
  return (
    <div>
      <button onClick = {handleClick}>Toast me</button>
    </div>
  )
}
