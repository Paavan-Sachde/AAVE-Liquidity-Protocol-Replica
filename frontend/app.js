// document.addEventListener('DOMContentLoaded', () => {
//     const connectWalletButton = document.getElementById('connect-wallet');
//     const walletDetailsSection = document.getElementById('wallet-details-section');
//     const walletDetailsContainer = document.getElementById('wallet-details');
//     const walletDescription = document.getElementById('wallet-desc');

//     if (connectWalletButton) { // Check if the button is found in the DOM
//         connectWalletButton.addEventListener('click', async () => {
//             try {
//                 // Check if MetaMask is installed
//                 if (window.ethereum) {
//                     const ethereum = window.ethereum;
                    
//                     // Request access to the user's MetaMask account
//                     await ethereum.request({ method: 'eth_requestAccounts' });

//                     // Get the selected account
//                     const accounts = await ethereum.request({ method: 'eth_accounts' });
//                     const selectedAccount = accounts[0];

//                     // Display the account details in the wallet details container
//                     walletDetailsContainer.innerHTML = `
//                         <p>Connected Account: ${selectedAccount}</p>
//                     `;

//                     // Show the wallet details section
//                     walletDetailsSection.style.display = 'block';
//                     walletDescription.style.display = 'none';
//                 } else {
//                     console.error('MetaMask is not installed');
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         });
//     } else {
//         console.error('Connect Wallet button not found in the DOM');
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     const connectWalletButton = document.getElementById('connect-wallet');
//     const walletDetailsSection = document.getElementById('wallet-details-section');
//     const walletDetailsContainer = document.getElementById('wallet-details');
//     const walletDescription = document.getElementById('wallet-desc');

//     if (connectWalletButton) {
//         connectWalletButton.addEventListener('click', async () => {
//             try {
//                 // Check if MetaMask is installed
//                 if (window.ethereum) {
//                     const ethereum = window.ethereum;

//                     // Request access to the user's MetaMask account
//                     await ethereum.request({ method: 'eth_requestAccounts' });

//                     // Get the selected accounts for the Polygon mainnet
//                     const accounts = await ethereum.request({ method: 'eth_accounts' });

//                     // Fetch balances for each account
//                     const balances = await Promise.all(accounts.map(async (account) => {
//                         const balance = await ethereum.request({
//                             method: 'eth_getBalance',
//                             params: [account, 'latest'],
//                         });
//                         return balance;
//                     }));

//                     // Display the account details and balances in the wallet details container
//                     let detailsHTML = '<h2>Connected Wallet Details</h2>';
//                     detailsHTML += '<ul>';
//                     for (let i = 0; i < accounts.length; i++) {
//                         const balanceInWei = balances[i];
//                         const balanceInMatic = balanceInWei / 10**18; // Convert from Wei to MATIC
//                         detailsHTML += `<li>Account ${i + 1}: ${accounts[i]}</li>`;
//                         detailsHTML += `<li>Balance: ${balanceInMatic} MATIC</li>`;
//                     }
//                     detailsHTML += '</ul>';

//                     // Show the wallet details section and hide the wallet description
//                     walletDetailsContainer.innerHTML = detailsHTML;
//                     walletDetailsSection.style.display = 'block';
//                     walletDescription.style.display = 'none';
//                 } else {
//                     console.error('MetaMask is not installed');
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         });
//     } else {
//         console.error('Connect Wallet button not found in the DOM');
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const connectWalletButton = document.getElementById('connect-wallet');
    const walletDetailsSection = document.getElementById('wallet-details-section');
    const walletDetailsContainer = document.getElementById('wallet-details');
    const walletDescription = document.getElementById('wallet-desc');

    if (connectWalletButton) {
        connectWalletButton.addEventListener('click', async () => {
            try {
                // Check if MetaMask is installed
                if (window.ethereum) {
                    const ethereum = window.ethereum;

                    // Request access to the user's MetaMask account
                    await ethereum.request({ method: 'eth_requestAccounts' });

                    // Get the selected accounts and their chain IDs
                    const accounts = await ethereum.request({ method: 'eth_accounts' });
                    const chainId = await ethereum.request({ method: 'eth_chainId' });

                    // Fetch balances for each account
                    const balances = await Promise.all(accounts.map(async (account) => {
                        let balance;
                        if (chainId === '0x1') { // Ethereum mainnet
                            balance = await ethereum.request({
                                method: 'eth_getBalance',
                                params: [account, 'latest'],
                            });
                        } else if (chainId === '0x89') { // Polygon mainnet
                            balance = await ethereum.request({
                                method: 'eth_getBalance',
                                params: [account, 'latest'],
                            });
                        }
                        return balance;
                    }));

                    // Display the account details and balances in the wallet details container
                    let detailsHTML = '<h2>Connected Wallet Details</h2>';
                    detailsHTML += '<ul>';
                    for (let i = 0; i < accounts.length; i++) {
                        const balanceInWei = balances[i];
                        const balance = parseFloat(balanceInWei) / 10**18; // Convert from Wei to ETH
                        detailsHTML += `<li>Account ${i + 1}: ${accounts[i]}</li>`;
                        detailsHTML += `<li>Balance: ${balance} ETH</li>`;
                    }
                    detailsHTML += '</ul>';

                    // Show the wallet details section and hide the wallet description
                    walletDetailsContainer.innerHTML = detailsHTML;
                    walletDetailsSection.style.display = 'block';
                    walletDescription.style.display = 'none';
                } else {
                    console.error('MetaMask is not installed');
                }
            } catch (error) {
                console.error(error);
            }
        });
    } else {
        console.error('Connect Wallet button not found in the DOM');
    }
});



