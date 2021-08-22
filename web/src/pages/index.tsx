import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link"
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";

const Index = () => {
    const [{ data, fetching }] = usePostsQuery({
        variables: {
            limit: 10,

        }
    });

    if (!fetching && !data) {
        return <div> you got no posts for some reason </div>
    }
    return (
        <Layout>
            <Flex>
                <Heading>Foliobook</Heading>
                <NextLink href="/create-post">
                    <Link ml='auto'> create post </Link>
                </NextLink>
            </Flex>
            <br />
            {fetching && !data ? (
                <div>loading...</div>
            ) : (
                //! declares data to be defined, telling Typescript "don't worry about it"
                <Stack spacing={8}>
                    {data!.posts.map((p) => (
                        <Box p={5} shadow="md" borderWidth="1px">
                            <Heading fontSize="xl">{p.title}</Heading>
                            <Text mt={4}>{p.textSnippet}</Text>
                        </Box>
                    ))}
                </Stack>
            )}
            {data ? (
                <Flex>
                    <Button isLoading={fetching} m="auto" my={4}>
                        load more
                    </Button>
                </Flex>
            ) : null}
            
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient) (Index);