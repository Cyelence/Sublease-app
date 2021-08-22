import React, { HtmlHTMLAttributes, InputHTMLAttributes } from 'react'
import { useField } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean
};

// '' => false
// 'error message stuff' => true

export const InputField: React.FC<InputFieldProps> = ({
    label, 
    textarea,
    size:_, 
    ...props
}) => {
        let InputOrTextarea = Input as any
        if (textarea) {
            InputOrTextarea = Textarea
        }
        const [field, {error}] = useField(props);

        return ( 
            <FormControl inInvalid={!!error}>
                <FormLabel htmlFor="name">{label}</FormLabel>
                <InputOrTextarea
                {...field}
                {...props} 
                id={field.name} 
                placeholder={props.placeholder} />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}