import { Flex, Text, FlexItem } from "@fluentui/react-northstar";
import { ArrowDownIcon, ArrowUpIcon } from '@fluentui/react-icons-northstar';

class TableSort {

    rows;

    constructor (header, setHeader) {
        this.header = header;
        this.setHeader = setHeader;
    }

    // Set rows
    setRows = (rows) => this.rows = rows;

    // Compare sort values
    compare = (key, order) => {
        return (a, b) => {
            if (order === 'asc') {
                if (a.items[key].content < b.items[key].content) return -1;
                if (a.items[key].content > b.items[key].content) return 1;
            }
            else {
                if (a.items[key].content > b.items[key].content) return -1;
                if (a.items[key].content < b.items[key].content) return 1;
            }

            return 0;
        };
    };

    // Custom sort item content
    doSort = (key) => {
        let newHeader = { ...this.header };
        let order = newHeader.items[key]['aria-sort'] ?? 'asc';

        this.rows.sort(this.compare(key, order));

        order = order === 'asc' ? 'desc' : 'asc';

        newHeader.items[key].icon = order === 'asc' ? 'arrowDown' : 'arrowUp';
        newHeader.items[key]['aria-sort'] = order;

        this.setHeader(newHeader);
        this.toggleIcon(key);
    };

    // Toggle header cell icon onMouseOver and onMouseLeave
    toggleIcon = (key, show = true) => {
        let newHeader = { ...this.header };
        let title = newHeader.items[key].title;

        if (show) {
            let icon = newHeader.items[key].icon;

            newHeader.items[key].content = icon === 'arrowUp' ? this.arrowUp(title) : this.arrowDown(title);
        }
        else {
            newHeader.items[key].content = title;
        }

        this.setHeader(newHeader);
    };

    // Add  ArrowUp icon to header cell content
    arrowUp = (title) =>
        <Flex gap="gap.small">
            <FlexItem><Text content={title} /></FlexItem>
            <FlexItem><ArrowUpIcon /></FlexItem>
        </Flex>;

    // Add  ArrowDown icon to header cell content
    arrowDown = (title) =>
        <Flex gap="gap.small">
            <FlexItem><Text content={title} /></FlexItem>
            <FlexItem><ArrowDownIcon /></FlexItem>
        </Flex>;
}

export default TableSort;