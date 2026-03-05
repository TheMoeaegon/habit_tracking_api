import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.ts';
import db from '../db/connection.ts';
import { habits, habitTags, tags } from '../db/schema.ts';
import { and, desc, eq } from 'drizzle-orm';

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount, tagsIds } = req.body;
    const result = await db.transaction(async tx => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId: req.user?.userId,
          description,
          name,
          frequency,
          targetCount,
        })
        .returning();

      if (tagsIds && tagsIds.length > 0) {
        const habitTagValues = tagsIds.map(tagId => ({
          habitId: newHabit.id,
          tagId,
        }));
        await tx.insert(habitTags).values(habitTagValues);
      }

      return newHabit;
    });
    res.status(201).json({
      message: 'Habit created',
      habit: result,
    });
  } catch (error) {
    console.error('Create Habit Error: ', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

export const getUserHabits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user.userId),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    });

    const habitWithTags = userHabitsWithTags.map(habit => ({
      ...habit,
      tags: habit.habitTags.map(ht => ht.tag),
      habitTags: undefined,
    }));

    res.status(200).json({
      habits: habitWithTags,
    });
  } catch (error) {
    console.error('Get Habit Error: ', error);
    res.status(500).json({ error: 'Failed to fetch habit' });
  }
};

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { tagIds, ...updates } = req.body;

    const result = await db.transaction(async tx => {
      const [updatedHabit] = await tx
        .update(habits)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(and(eq(habits.id, id), eq(habits.userId, req.user.userId)))
        .returning();

      if (!updatedHabit) {
        return res.status(401).end();
      }

      if (tagIds !== undefined) {
        await tx.delete(habitTags).where(eq(habitTags.habitId, id));

        if (tagIds && tagIds.length > 0) {
          const habitTagValues = tagIds.map(tagId => ({
            habitId: updatedHabit.id,
            tagId,
          }));
          await tx.insert(habitTags).values(habitTagValues);
        }
      }

      return updatedHabit;
    });

    return res.json({
      messgae: 'Habit was updated',
      habit: result,
    });
  } catch (error) {
    console.error('Update Habit Error: ', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
};
