import { useField } from 'formik'


const Input = ({name, type, disabled, ...props}) => {

    const [field, meta] = useField({
        name: name,
        type: type,
    });


    return <label>
        <input {...props} {...field} disabled={disabled} className={`px-6 py-4 rounded-full border border-gray-400 w-full ${disabled && 'bg-gray-200 text-black font-bold'}`} />
    </label>;
};

export default Input;
