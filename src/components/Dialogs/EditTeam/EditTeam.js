import { Dialog, CloseIcon } from "@fluentui/react-northstar";
import TopCard from "../../../helpers/TopCard";

const EditTeam = ({ open, setOpen }) => {

    return (
        <Dialog
            open={open}
            cancelButton="Close"
            onOpen={() => setOpen(true)}
            onCancel={() => setOpen(false)}
            header={<TopCard title="EA2635" subTitle="Green Africa Ramp" avatar="https://images.unsplash.com/photo-1531642765602-5cae8bbbf285" />}
            headerAction={{
                icon: <CloseIcon />,
                title: 'Close',
                onClick: () => setOpen(false),
            }}
            footer={{
                children: (Component, props) => {
                    const { styles, ...rest } = props
                    return (
                        <div>

                            <Component {...rest} />
                        </div>
                    )
                },
            }}
        />
    )
};

export default EditTeam;