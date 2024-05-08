import { AuthProvider } from "@/components/state/AuthProvider";
import { Box } from "@yamada-ui/react";
import { NextPage } from "next";

const Setting:NextPage=()=>{
    return<AuthProvider>
        <Box color={"red.400"}>セッティング画面 box test</Box>

    </AuthProvider>
} 

export default Setting

