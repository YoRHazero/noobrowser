import {
    Box,
    Heading,
    Text,
    Highlight,
    Separator
} from "@chakra-ui/react";

export default function Title()
{
    return (
        <Box>
            <Heading lineHeight={1.2} size='5xl' fontWeight='medium' >
                <Highlight
                    query={['N', 'O', 'Browser']}
                    styles={{color: 'black.600', fontSize: '6xl', fontWeight: 'bold'}}>
                    Not Only Observation Browser
                </Highlight>   
            </Heading> 
            <Separator size='lg' />
            <Text fontSize='lg' fontWeight='medium' my={3} >
                A web-based platform for visualizing and analyzing WFSS data
            </Text>
        </Box>
    
    )
}