import { Flex, FlexItem, FormDropdown } from "@fluentui/react-northstar";

const Filters = () => {


    return (
        <Flex gap="gap.small">
            <FlexItem>
                <FormDropdown label="Flight between" items={['prague', 'new york']} inline />
            </FlexItem>
        </Flex>
    )
};

export default Filters;