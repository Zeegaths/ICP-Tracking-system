import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as orderIdlFactory, canisterId } from "../../../declarations/dfinity_js_backend/index";

const ORDER_CANISTER_ID = canisterId;
const HOST = "http://localhost:4943";

export async function getOrderCanister() {
    return await getCanister(ORDER_CANISTER_ID, orderIdlFactory);
}

async function getCanister(canisterId, idl) {
    const authClient = window.auth.client;
    const agent = new HttpAgent({
        host: HOST,
        identity: authClient.getIdentity()
    });
    await agent.fetchRootKey(); // this line is needed for the local env only
    return Actor.createActor(idl, {
        agent,
        canisterId,
    });
}