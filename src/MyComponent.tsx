export default function  MyComponent(props: {field1:string, field2:string}) {
    return (
        <div>
            <p>Hello! {props.field1 + props.field2}</p>
        </div>
    )
}
