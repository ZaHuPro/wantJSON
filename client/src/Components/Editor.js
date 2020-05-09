import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import '../assets/vendor/code.css';

import {
  Label, ErrorBlock, CodeWrapper, CodeItem,
} from './Basic/Form';

export default function CodeEditor({
  setCode, codeError, setCodeError, codeString, setCodeString,
}) {
  const handleCodeChange = (codeIs) => {
    setCodeString(codeIs);
    try {
      const JSONCode = JSON.parse(codeIs);
      if (typeof JSONCode === 'object') {
        setCode(JSONCode);
        setCodeError({ status: false, msg: '' });
      } else {
        setCodeError({ status: true, msg: 'Provide a valid JSON formate !' });
      }
    } catch (err) {
      setCodeError({ status: true, msg: 'Provide a valid JSON formate !' });
    }
  };

  return (
    <CodeItem>
      <Label hasError={codeError.msg !== ''}>JSON Code</Label>
      <CodeWrapper hasError={codeError.msg !== ''}>
        <Editor
          name="data"
          value={codeString}
          onValueChange={(codeIs) => handleCodeChange(codeIs)}
          padding={10}
          highlight={(codeIs) => highlight(codeIs, languages.json)}
          textareaClassName="code-textbox code-box"
          preClassName="code-pre code-box"
          style={{
            minHeight: '300px',
            background: '#060940',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '20px',
          }}
        />
      </CodeWrapper>
      <ErrorBlock>{codeError.msg}</ErrorBlock>
    </CodeItem>

  );
}
