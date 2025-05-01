# yourapp/bluetooth_utils.py
import asyncio
from bleak import BleakScanner, BleakClient

async def scan_for_devices(timeout=5):
    devices = await BleakScanner.discover(timeout)
    return [(d.address, d.name or "") for d in devices]

async def pair_device(address):
    async with BleakClient(address) as client:
        return await client.pair()