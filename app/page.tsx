"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GoldPackage {
  id: number
  gold: number
  price: number
  unitCost: number
}

export default function Home() {
  const [packages, setPackages] = useState<GoldPackage[]>([])
  const [gold, setGold] = useState('')
  const [price, setPrice] = useState('')
  const [isClient, setIsClient] = useState(false)
  const goldInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('goldPackages')
    if (saved) {
      setPackages(JSON.parse(saved))
    }
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('goldPackages', JSON.stringify(packages))
    }
  }, [packages, isClient])

  const addPackage = (e: React.FormEvent) => {
    e.preventDefault()
    const goldAmount = parseFloat(gold)
    const priceAmount = parseFloat(price)
    if (goldAmount > 0 && priceAmount > 0) {
      const newPackage: GoldPackage = {
        id: Date.now(),
        gold: goldAmount,
        price: priceAmount,
        unitCost: priceAmount / goldAmount
      }
      setPackages([...packages, newPackage])
      setGold('')
      setPrice('')
      goldInputRef.current?.focus()
    }
  }

  const removePackage = (id: number) => {
    setPackages(packages.filter(pkg => pkg.id !== id))
  }

  const sortedPackages = [...packages].sort((a, b) => a.unitCost - b.unitCost)

  if (!isClient) {
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Gold Package Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPackage} className="flex space-x-2 mb-4">
            <Input
              ref={goldInputRef}
              type="number"
              placeholder="Gold amount"
              value={gold}
              onChange={(e) => setGold(e.target.value)}
              className="flex-grow"
            />
            <Input
              type="number"
              placeholder="Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-grow"
              step="0.01"
            />
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </form>

          {sortedPackages.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gold</TableHead>
                  <TableHead>Price ($)</TableHead>
                  <TableHead>Unit Cost ($/gold)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPackages.map((pkg) => (
                  <TableRow key={pkg.id} className={pkg.unitCost === sortedPackages[0].unitCost ? "font-bold" : ""}>
                    <TableCell>{pkg.gold}</TableCell>
                    <TableCell>{pkg.price.toFixed(2)}</TableCell>
                    <TableCell>{pkg.unitCost.toFixed(4)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removePackage(pkg.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
