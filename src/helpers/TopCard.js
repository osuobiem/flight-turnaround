import { Card, Flex, Text, Avatar } from "@fluentui/react-northstar"

const TopCard = ({title, subTitle, avatar}) => {
    return <Card aria-roledescription="card avatar" compact ghost>
        <Card.Header fitted>
            <Flex gap="gap.small">
                <Avatar
                    image={avatar}
                    label={title} name="EA2635" square className="tpc-header-img"
                    styles={{ height: '2.5rem', width: '2.5rem' }}/>
                <Flex column>
                <Text content={title} weight="bold" size="medium" />
                <Text content={subTitle} size="small" weight="light" color="grey" />
                </Flex>
            </Flex>
        </Card.Header>
    </Card>
}
    
export default TopCard;