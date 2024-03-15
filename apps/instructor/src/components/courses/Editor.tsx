import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

function Editor({
    onChange, value
}: EditorProps) {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [])
    return (
        <div>
            <ReactQuill
                theme='snow'
                onChange={onChange}
                value={value}
            />
        </div>
    )
}

export default Editor