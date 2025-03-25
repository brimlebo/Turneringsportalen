import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Badge, Code, DataList, Flex, IconButton, Link } from '@radix-ui/themes'
import { CopyIcon } from '@radix-ui/react-icons'


export default async function PrivatePage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/')
    }
    const user = data.user;

    return (
        <div>
            <p>Hello {user.email}</p>
            <DataList.Root>
                <DataList.Item align="center">
                    <DataList.Label minWidth="88px">Status</DataList.Label>
                    <DataList.Value>
                        <Badge color="jade" variant="soft" radius="full">
                            {user.confirmed_at ? 'Confirmed' : 'Unconfirmed'}
                        </Badge>
                    </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label minWidth="88px">ID</DataList.Label>
                    <DataList.Value>
                        <Flex align="center" gap="2">
                            <Code variant="ghost">{user.id}</Code>
                            <IconButton
                                size="1"
                                aria-label="Copy value"
                                color="gray"
                                variant="ghost"
                            >
                                <CopyIcon />
                            </IconButton>
                        </Flex>
                    </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label minWidth="88px">Name</DataList.Label>
                    <DataList.Value>{user.user_metadata.username}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label minWidth="88px">Email</DataList.Label>
                    <DataList.Value>
                        <Link href={`mailto:${user.email}`}>{user.email}</Link>
                    </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label minWidth="88px">Role</DataList.Label>
                    <DataList.Value>{user.user_metadata.userrole}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label minWidth="88px">Created at</DataList.Label>
                    <DataList.Value>{user.created_at}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label minWidth="88px">Updated at</DataList.Label>
                    <DataList.Value>{user.updated_at}</DataList.Value>
                </DataList.Item>
            </DataList.Root>
        </div>
    );
}
