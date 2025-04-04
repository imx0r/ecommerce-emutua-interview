import IconInfo from "@/components/icons/IconInfo";
import IconSuccess from "@/components/icons/IconSuccess";
import IconWarning from "@/components/icons/IconWarning";
import IconError from "@/components/icons/IconError";
import Link from 'next/link';

type AlertTypes = 'info' | 'warning' | 'success' | 'error';
type ActionTypes = 'btn' | 'link';

interface AlertActions {
    type: ActionTypes;
    text: string;
    href?: string;
    callback?: () => {}
}

export default function Alert({ title, text, type = "info", classes = "", actions = undefined }: Readonly<{ title?: string, text: string, classes?: string, type: AlertTypes, actions?: AlertActions[] }>) {
    let alertConfig: { class: string, icon: React.ReactNode };
    switch (type) {
        case "info": alertConfig = { class: "alert-info", icon: <IconInfo /> }; break;
        case "warning": alertConfig = { class: "alert-warning", icon: <IconWarning />}; break;
        case "success": alertConfig = { class: "alert-success", icon: <IconSuccess />}; break;
        case "error": alertConfig = { class: "alert-error", icon: <IconError />}; break;
    }
    
    return (
        <div role="alert" className={`alert alert-vertical sm:alert-horizontal ${alertConfig.class} alert-soft ${classes}`}>
            { alertConfig.icon }
            <div>
                { title && <h3 className="font-bold">{ title }</h3> }
                { title ? <div className="text-xs">{ text }</div> : <span>{ text }</span> }
            </div>
            { actions && actions.map((action) => {
                if (action.type === 'btn') {
                    return (
                        <button className={`btn btn-sm`} onClick={action.callback}>{ action.text }</button>
                    );
                }

                return (
                    <Link href={action.href ?? '/'} className={`btn btn-sm`}>{ action.text }</Link>
                );
            })}
        </div>
    );
}