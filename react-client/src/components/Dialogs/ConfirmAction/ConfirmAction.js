import { Dialog } from "@fluentui/react-northstar"

const ConfirmAction = ({open, setOpen, content, confirmText, action = () => {}}) => {
    return <Dialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={async () => { await action(); setOpen(false) }}
        cancelButton="No"
        confirmButton={confirmText}
        header="Confirm Action"
        content={content} />;
};

export default ConfirmAction;