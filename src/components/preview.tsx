import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  error: string;
}

const html = `
    <html style="height: 100%;">
      <head>
        <style>html { background-color: white; }</style>
      </heaad>
      <body style="height: calc(100% - 16px); position: relative;">
        <div id="root"></div>
        <div id="rtl-error" style="display: none; height: 100%; position: fixed; bottom: 0"; width: calc(100% - 16px); z-index: 20;">
          <div onclick="hideError()" style="position: absolute; top: 12px; right: 12px; z-index: 200; cursor: pointer;">X</div>
        </div>
        <script>
          const hideError = () => {
            const errEl = document.querySelector('#rtl-error');
              errEl.style.display = 'none';
          }
          const handleRTLError = (err) => {
            const errEl = document.querySelector('#rtl-error');
            errEl.style.display = 'block';

            const pre = document.createElement('pre');
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.margin = '6px';
            pre.style.height = 'calc(100% - 24px)';
            pre.style.padding = '6px';
            pre.style.border = '1px solid red';
            pre.style.borderRadius = '2px';
            pre.style.overflow = 'auto';
            pre.style.backgroundColor = '@ffaaaa';

            pre.innerText = err.message.replace(/--------------------------------------------------/g, '-----------------------');
            errEl.appendChild(pre);
          };
          
          const handleError = (err) => {
            if (err.rtlError) {
              return handleRTLError(err);
            }
            handleRTLError(err);
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });
          window.addEventListener('unhandledrejection', (event) => {
            event.preventDefault();
            handleError(event.reason);
          });

          window.addEventListener('message', (event) => {
            try {
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.async = true;
              script.appendChild(document.createTextNode(event.data));
              document.body.appendChild(script);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>`;

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    if (iframe.current) {
      iframe.current.srcdoc = html;

      setTimeout(() => {
        if (iframe.current) {
          iframe.current.contentWindow.postMessage(code, "*");
        }
      }, 50);
    }
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='preview'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
      />
      {error && <div className='preview-error'>{error}</div>}
    </div>
  );
};

export default Preview;
