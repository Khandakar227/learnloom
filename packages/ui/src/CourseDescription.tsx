
export default function CourseDescription({description, short}:{description:string, short:boolean}) {
  return (
    <div dangerouslySetInnerHTML={{__html: description}} />
  )
}
