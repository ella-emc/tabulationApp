import {useState} from 'react';


const useLockInput = () => {
    const [isLocked, setIsLocked] = useState(false)

    return {
        isLocked,
        setIsLocked,
    }
};

export default useLockInput;
